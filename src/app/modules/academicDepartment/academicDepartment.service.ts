/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-array-constructor */
import { AcademicDepartment } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { AcademicDepartmentSearchAbleField } from './academicDepartment.constant';
import { IAcademicDepartmentFilter } from './academicDepartment.interface';

const getAllFromDb = async (
  filters: IAcademicDepartmentFilter,
  options: IPaginationOptions
): Promise<IGenericResponse<AcademicDepartment[]>> => {
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;
  const andConditions = new Array();
  if (searchTerm) {
    andConditions.push({
      OR: AcademicDepartmentSearchAbleField.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }
  const whereConditions =
    andConditions.length > 0 ? { AND: andConditions } : {};
  const result = await prisma.academicDepartment.findMany({
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
  });

  const total = await prisma.academicDepartment.count();
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};
const getDataById = async (id: string): Promise<AcademicDepartment | null> => {
  const result = await prisma.academicDepartment.findUnique({
    where: {
      id,
    },
  });
  return result;
};
const insertIntoDb = async (
  data: AcademicDepartment
): Promise<AcademicDepartment | null> => {
  const result = await prisma.academicDepartment.create({data:data})
  return result;
};
const updateIntoDb = async (id: string, data: Partial<AcademicDepartment>): Promise<AcademicDepartment> => {
  const result = await prisma.academicDepartment.update({
    where: {
      id
    },
      data
  })
  return result;
}
const deleteFromDb=async (id: string): Promise<AcademicDepartment> => {
  const result = await prisma.academicDepartment.delete({
    where: {
      id
    }
  })
  return result
}
export const AcademicDepartmentService = {
  getAllFromDb,
  getDataById,
  insertIntoDb,
  updateIntoDb,
  deleteFromDb,
};
