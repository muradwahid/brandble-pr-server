/* eslint-disable @typescript-eslint/no-explicit-any */
import { AcademicFaculty } from '@prisma/client';
import prisma from '../../../shared/prisma';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IAcademicFacultyFilter } from './academicFaculty.interface';
import { AcademicFacultySearchableFields } from './academicFaculty.constant';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';

const getAllFromDb = async (
  options: IPaginationOptions,
  filters: IAcademicFacultyFilter
): Promise<IGenericResponse<AcademicFaculty[] | null>> => {
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;
  const andConditions = [];
  if (searchTerm) {
    andConditions.push({
      OR: AcademicFacultySearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filterData).length>0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => ({
        [key]: {
          equals: (filterData as any)[key],
        }
      }))
    })
  }
  const whereConditions =
    andConditions.length > 0
      ? {
          AND: andConditions,
        }
      : {};
  const result = await prisma.academicFaculty.findMany({
    where:whereConditions,
    skip,
    take: limit,
    orderBy: options.sortBy && options.sortOrder? {
      [options.sortBy as any]: options.sortOrder,
    } : {
      createdAt: 'desc',
    }
  });
  const total = await prisma.academicFaculty.count()
  return {
    meta: {
      limit,
      page,
      total
    },
    data: result
  };
};
const getDataById = async (id: string):Promise<AcademicFaculty | null> => {
  const result = await prisma.academicFaculty.findUnique({
    where: {
      id
    }
  })
  return result
}
const insertIntoDb = async (
  data: AcademicFaculty
): Promise<AcademicFaculty | null> => {
  const result = await prisma.academicFaculty.create({ data });
  return result;
};
const updateIntoDb = async (id:string,data:Partial<AcademicFaculty>):Promise<AcademicFaculty> => { 
  const result = await prisma.academicFaculty.update({
    where: {
      id
    },
    data
  })
  return result;
}
const deleteFromDb =async (id:string):Promise<AcademicFaculty> => {
  const result = await prisma.academicFaculty.delete({
    where: {
      id
    }
  })
  return result;
}
export const AcademicFacultyService = {
  getAllFromDb,
  getDataById,
  insertIntoDb,
  updateIntoDb,
  deleteFromDb,
};