/* eslint-disable @typescript-eslint/no-explicit-any */
import { Building, Prisma } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { buildingSearchAbleFields } from './building.constant';
import { IBuildingFilterRequest } from './building.interface';

const insertIntoDb = async (data: Building): Promise<Building> => {
  const result = await prisma.building.create({
    data,
  });
  return result;
};
const getAllFromDb = async (
  options: IPaginationOptions,
  filters: IBuildingFilterRequest
): Promise<IGenericResponse<Building[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm } = filters;
  const andConditions = [];
  if (searchTerm) {
    andConditions.push({
      OR: buildingSearchAbleFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }
  const whereConditions: Prisma.BuildingWhereInput =
    andConditions.length > 0
      ? {
          AND: andConditions,
        }
      : {};
  const result = await prisma.building.findMany({
    skip,
    take: limit,
    where: whereConditions,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy as any]: options.sortOrder,
          }
        : {
            createdAt: 'desc',
          },
  });
  return {
    meta: {
      limit,
      page,
      total: await prisma.building.count(),
    },
    data: result,
  };
};
const getDataById=async (id:string):Promise<Building | null> => {
  const result = await prisma.building.findUnique({
    where: {
      id
    }
  })
  return result
}
const updateIntoDb=async (id:string,data:Partial<Building>):Promise<Building | null> => {
  const result = await prisma.building.update({
    where: {
      id
    },
    data
  })
  return result
}
const deleteFromDb=async (id:string):Promise<Building | null> => {
  const result = await prisma.building.delete({
    where: {
      id
    }
  })
  return result
}
export const BuildingService = {
  insertIntoDb,
  getAllFromDb,
  getDataById,
  updateIntoDb,
  deleteFromDb,
};
