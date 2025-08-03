/* eslint-disable @typescript-eslint/no-explicit-any */
import { Prisma, Student } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { IGenericResponse } from "../../../interfaces/common";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { IFilterAbleFields } from "./student.interface";
import { StudentSearchAbleField } from "./student.constant";

const getAllFromDb = async(options:IPaginationOptions,filters:IFilterAbleFields):Promise<IGenericResponse<Student[]>> => {
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filtersData } = filters;
  const andConditions = [];
  if (searchTerm) {
    andConditions.push({
      OR: StudentSearchAbleField.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        }
      }))
    })
  }
  if (Object.keys(filtersData).length>0) {
    andConditions.push({
      AND:Object.keys(filtersData).map(key => ({
        [key]: {
          equals: (filtersData as any)[key],
        }
      }))
    })
  }
  const whereConditions:Prisma.StudentWhereInput= andConditions.length>0 ? {
    AND: andConditions,
  }:{}
  const result = await prisma.student.findMany({
    where:whereConditions,
    skip,
    take: limit,
    orderBy:options.sortBy&& options.sortOrder?{
      [options.sortBy as any]: options.sortOrder,
    } : {
      createdAt: 'desc',
    },
    include:{
      academicDepartment: true,
      academicSemester: true,
      academicFaculty: true,
    }
  })
  const total = await prisma.student.count();
  return {
    meta: {
      limit,
      page,
      total
    },
    data:result
  }
}
const getDataById=async(id:string):Promise<Student | null> => {
  const result = await prisma.student.findUnique({
    where:{
      id
    },
    include:{
      academicDepartment: true,
      academicSemester: true,
      academicFaculty: true,
    }
  })
  return result
}
const insertIntoDb = async (data: Student): Promise<Student> => {
  const result = await prisma.student.create({
    data,
    include: {
      academicDepartment: true,
      academicSemester: true,
      academicFaculty: true,
    }
  });
  return result;
};
const updateIntoDb=async (id:string,payload:Partial<Student>):Promise<Student> => {
  
  const result = await prisma.student.update({
    where: {
      id,
    },
    data: payload,
    include: {
      academicDepartment: true,
      academicSemester: true,
      academicFaculty: true,
    },
  });
  return result
}
const deleteFromDb=async (id:string):Promise<Student> => {
  const result = await prisma.student.delete({
    where:{
      id
    },
    include:{
      academicDepartment: true,
      academicSemester: true,
      academicFaculty: true,
    }
  })
  return result
}
export const StudentService = {
  getAllFromDb,
  getDataById,
  insertIntoDb,
  updateIntoDb,
  deleteFromDb,
};