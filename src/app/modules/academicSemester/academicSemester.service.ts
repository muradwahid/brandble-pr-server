/* eslint-disable @typescript-eslint/no-explicit-any */
import { AcademicSemester, Prisma } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { AcadedmicSemestersearchAbleFields } from './academicSemester.constant';
import { IAcademicSemesterFilterResponse } from './academicSemester.interface';
import prisma from '../../../shared/prisma';

const getAllFromDb = async (
  filters: IAcademicSemesterFilterResponse,
  options: IPaginationOptions
): Promise<IGenericResponse<AcademicSemester[]>> => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filtersData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: AcadedmicSemestersearchAbleFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }
  if (Object.keys(filtersData).length > 0) {
    andConditions.push({
      AND: Object.keys(filtersData).map(field => ({
        [field]: {
          equals: (filtersData as any)[field],
        },
      })),
    });
  }

  const whereConditions: Prisma.AcademicSemesterWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};
  const result = await prisma.academicSemester.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? {
            [options.sortBy as any]: options.sortOrder,
          }
        : {
            createdAt: 'desc',
          },
  });
  const total = await prisma.academicSemester.count();
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};
const getDataById = async (id: string): Promise<AcademicSemester| null> => {
  const result = await prisma.academicSemester.findUnique({
    where: {
      id
    }
  })
  return result
}
const insertIntoDb = async (
  data: AcademicSemester
): Promise<AcademicSemester> => {
  const result = await prisma.academicSemester.create({ data });
  return result;
};
const updateIntoDb = async (id:string,data:Partial<AcademicSemester>):Promise<AcademicSemester> => { 
  const result = await prisma.academicSemester.update({
    where: {
      id
    },
    data
  })
  return result
}
const deleteFromDb = async (id:string):Promise<AcademicSemester> => {
  const result = await prisma.academicSemester.delete({
    where: {
      id
    }
  })
  return result;
}
export const AcademicSemesterService = {
  getAllFromDb,
  getDataById,
  insertIntoDb,
  updateIntoDb,
  deleteFromDb,
};
