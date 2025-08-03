/* eslint-disable @typescript-eslint/no-explicit-any */
import { Prisma, Room } from '@prisma/client';
import prisma from '../../../shared/prisma';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IRoomFilterResponse } from './room.interface';
import { roomSearchAbleFields } from './room.constant';


const getAllFromDb=async(options: IPaginationOptions, filters:IRoomFilterResponse): Promise<IGenericResponse<Room[]>> => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filtersData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: roomSearchAbleFields.map(field => ({
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

  const whereConditions: Prisma.RoomWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};
  const result = await prisma.room.findMany({
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
  const total = await prisma.room.count();
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
}
const getDataById=async (id:string) => {
  const result= await prisma.room.findUnique({
    where: {
      id
    },
    include: {
      building: true
    }
  })
  return result
}
const insertIntoDb = async (data: Room): Promise<Room> => {
  console.log(data);
  const result = await prisma.room.create({
    data,
    include: {
      building: true,
    },
  });
  return result;
};
const updateIntoDb=async(id:string,data:Room) => {
  const result = await prisma.room.update({
    where: {
      id
    },
    data
  })
  return result
}
const deleteFromDb=async(id:string) => {
  const result = await prisma.room.delete({
    where: {
      id
    }
  })
  return result
}
export const RoomService = {
  insertIntoDb,
  getAllFromDb,
  getDataById,
  updateIntoDb,
  deleteFromDb,
};
