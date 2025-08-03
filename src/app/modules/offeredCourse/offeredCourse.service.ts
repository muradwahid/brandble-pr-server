import { OfferedCourse } from "@prisma/client"
import { ICreateOfferedCourse } from "./offeredCourse.interface"
import prisma from "../../../shared/prisma";




const getDataById = async (id: string) => {
  const result = await prisma.offeredCourse.findUnique({
    where: {
      id,
    }
  });
  return result
}

const inserIntoDb = async (
  data: ICreateOfferedCourse
): Promise<OfferedCourse[]> => {
  const { academicDepartmentId, courseIds, semesterRegistrationId } = data;
  const result: OfferedCourse[] = [];

  for (const courseId of courseIds) {
    try {
      const alreadyExist = await prisma.offeredCourse.findFirst({
        where: {
          academicDepartmentId,
          semesterRegistrationId,
          courseId,
        },
      });

      if (!alreadyExist) {
        const insertOfferedCourse = await prisma.offeredCourse.create({
          data: {
            academicDepartmentId,
            semesterRegistrationId,
            courseId,
          },
          include: {
            academicDepartment: true,
            semesterRegistration: true,
            course: true,
          },
        });
        result.push(insertOfferedCourse);
      }
    } catch (error) {
      console.error('Error during database operation:', error);
    }
  }

  return result;
};
const updateDataById = async(id:string,data: Partial<OfferedCourse>):Promise<OfferedCourse> => {
  const result = await prisma.offeredCourse.update({
    where: {
      id
    },
    data
  })
  return result
}
const deleteFromDb = async (id: string) => {
  const result = await prisma.offeredCourse.delete({
    where: {
      id
    }
  })
  return result;
}
export const OfferedCourseService = {
  inserIntoDb,
  getDataById,
  updateDataById,
  deleteFromDb,
};