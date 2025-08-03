import { OfferedCourseSection } from "@prisma/client";
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";

const inserIntoDb = async (data: any): Promise<OfferedCourseSection> => {
  const isExistOfferedCourse = await prisma.offeredCourse.findFirst({
    where: {
      id:data.offeredCourseId
    }
  })
  if (!isExistOfferedCourse) {
    throw new ApiError(httpStatus.OK,'Offered Course does not exist')
  }
  data.semesterRegestrationId=isExistOfferedCourse.semesterRegistrationId
  const result = await prisma.offeredCourseSection.create({
    data
  });
  return result
};

const getDataById = async (id: string) => { 
  const result = await prisma.offeredCourseSection.findUnique({ where: { id } });
  return result;
}
const updateFromDb = async(id: string, data: Partial<OfferedCourseSection>) => { 
  const result = await prisma.offeredCourseSection.update({ where: { id }, data })
  return result;
}
const deleteFromDb = async (id: string) => { 
  const result = await prisma.offeredCourseSection.delete({
    where: {id}
  })
  return result;
}
export const OfferedCourseSectionService = {
  inserIntoDb,
  getDataById,
  updateFromDb,
  deleteFromDb,
};
