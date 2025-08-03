/* eslint-disable @typescript-eslint/no-explicit-any */
import { Prisma, SemesterRegistration, SemesterRegistrationStatus } from '@prisma/client';
import prisma from '../../../shared/prisma';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { ISemesterRegistrationFilterAbleField } from './semesterRegistration.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { SemesterRegistrationSearchAbleField } from './semesterRegistration.constant';

const getAllFromDb = async (filters:ISemesterRegistrationFilterAbleField, options:IPaginationOptions) => {
    const { page, limit, skip } =
      paginationHelpers.calculatePagination(options);
    const { searchTerm, ...filtersData } = filters;
    const andConditions = [];
    if (searchTerm) {
      andConditions.push({
        OR: SemesterRegistrationSearchAbleField.map(field => ({
          [field]: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        })),
      });
    }
    if (Object.keys(filtersData).length > 0) {
      andConditions.push({
        AND: Object.keys(filtersData).map(key => ({
          [key]: {
            equals: (filtersData as any)[key],
          },
        })),
      });
    }
    const whereConditions: Prisma.SemesterRegistrationWhereInput =
      andConditions.length > 0
        ? {
            AND: andConditions,
          }
        : {};
    const result = await prisma.semesterRegistration.findMany({
      where: whereConditions,
      skip,
      take: limit,
      orderBy:
        options.sortBy && options.sortOrder
          ? {
              [options.sortBy as any]: options.sortOrder,
            }
          : {
              createdAt: 'desc',
            },
      include: {
        academicSemester: true,
      },
    });
    const total = await prisma.semesterRegistration.count();
    return {
      meta: {
        limit,
        page,
        total,
      },
      data: result,
    };
}
const insetIntoDb = async (
  data: SemesterRegistration
): Promise<SemesterRegistration> => {

  const isAnySemesterRegUpcomingOrOngoing = await prisma.semesterRegistration.findFirst({
    where: {
      OR: [
        { status: SemesterRegistrationStatus.UPCOMING },
        {status:SemesterRegistrationStatus.ONGOING}
      ]
    }
  })
  if (isAnySemesterRegUpcomingOrOngoing) {
    throw new ApiError(httpStatus.BAD_REQUEST,`There is already an ${isAnySemesterRegUpcomingOrOngoing.status} registration. `)
    
  }
  const result = await prisma.semesterRegistration.create({
    data,
  });
  return result;
};
const getDataById = async (id:string) => {
  const result =await prisma.semesterRegistration.findUnique({
    where: {
      id
    },
    include: {
      academicSemester: true
    }
  })
  return result;
}
const updateData = async (id: string, payload: Partial<SemesterRegistration>): Promise<SemesterRegistration | null> => {
  const isExist= await prisma.semesterRegistration.findUnique({
    where: {
      id
    }
  })
  if (!isExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Semester registration data not found')
  }
  if (payload.status && isExist.status===SemesterRegistrationStatus.UPCOMING && payload.status !== SemesterRegistrationStatus.ONGOING) {
    throw new ApiError(httpStatus.BAD_REQUEST,'Can only move from UPCOMING to ONGOING')
  }
  if (payload.status && isExist.status===SemesterRegistrationStatus.ONGOING && payload.status !== SemesterRegistrationStatus.ENDED) {
    throw new ApiError(httpStatus.BAD_REQUEST,'Can only move from ONGOING to ENDED')
  }
  const result = await prisma.semesterRegistration.update({
    where: {
      id
    },
    data: payload,
    include: {
      academicSemester: true
    }
  })
  return result;
}
const deleteFromDb = async (id:string) => {
  const result =await prisma.semesterRegistration.delete({
    where: {
      id
    },
    include: {
      academicSemester: true
    }
  })
  return result;
}
export const SemesterRegistrationSevice = {
  insetIntoDb,
  getAllFromDb,
  getDataById,
  updateData,
  deleteFromDb
};
