/* eslint-disable @typescript-eslint/no-explicit-any */
import { Course, CourseFaculty, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { asyncForEach } from '../../../shared/asyncForEach';
import prisma from '../../../shared/prisma';
import { courseSearchAbleFields } from './course.constant';
import {
  ICourseCreateData,
  ICourseFilterResponse,
  IPrerequisiteCourseResponse,
} from './course.interface';
const getAllFromDb = async (
  options: IPaginationOptions,
  filters: ICourseFilterResponse
): Promise<IGenericResponse<Course[]>> => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filtersData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: courseSearchAbleFields.map(field => ({
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
  const whereConditions: Prisma.CourseWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};
  const result = await prisma.course.findMany({
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
  const total = await prisma.course.count();
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};
const getDataById = async (id: string) => {
  const result = await prisma.course.findUnique({
    where: {
      id,
    },
  });
  return result;
};
const updateIntoDb = async (id: string, data: any): Promise<any> => {
  const { preRequisiteCourses, ...courseData } = data;

  await prisma.$transaction(async transactionClient => {
    const result = await transactionClient.course.update({
      where: {
        id,
      },
      data: courseData,
    });
    if (!result) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Unable to update course');
    }
    if (preRequisiteCourses && preRequisiteCourses.length > 0) {
      const deletePrerequisite = preRequisiteCourses.filter(
        (coursePrerequisite: { courseId: string; isDeleted: boolean }) =>
          coursePrerequisite.courseId && coursePrerequisite.isDeleted
      );
      const newPrerequisite = preRequisiteCourses.filter(
        (coursePrerequisite: { courseId: string; isDeleted: boolean }) =>
          coursePrerequisite.courseId && coursePrerequisite.isDeleted
      );
      await asyncForEach(
        deletePrerequisite,
        async (deletePrerequisiteCourse: IPrerequisiteCourseResponse) => {
          await transactionClient.courseToPrerequisite.deleteMany({
            where: {
              AND: [
                {
                  courseId: id,
                },
                {
                  preRequisiteId: deletePrerequisiteCourse.courseId,
                },
              ],
            },
          });
        }
      );
      await asyncForEach(
        newPrerequisite,
        async (newPrerequisiteCourse: IPrerequisiteCourseResponse) => {
          await transactionClient.courseToPrerequisite.create({
            data: {
              courseId: id,
              preRequisiteId: newPrerequisiteCourse.courseId,
            },
          });
        }
      );
    }
    return result;
  });

  const result = await prisma.course.findUnique({
    where: {
      id,
    },
    include: {
      preRequisite: {
        include: {
          prerequisite: true,
        },
      },
      preRequisiteFor: {
        include: {
          course: true,
        },
      },
    },
  });
  return result;
};
const insertIntoDb = async (
  data: ICourseCreateData
): Promise<ICourseCreateData | null> => {
  const { preRequisiteCourses, ...courseData } = data;
  const newCourses = await prisma.$transaction(async transactionClient => {
    const result = await transactionClient.course.create({ data: courseData });

    if (!result) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Unable to create course');
    }
    if (preRequisiteCourses && preRequisiteCourses.length > 0) {
      await asyncForEach(
        preRequisiteCourses,
        async (preRequisiteCourse: IPrerequisiteCourseResponse) => {
          await transactionClient.courseToPrerequisite.create({
            data: {
              courseId: result.id,
              preRequisiteId: preRequisiteCourse.courseId,
            },
          });
        }
      );
    }
    return result;
  });

  if (newCourses) {
    const result = await prisma.course.findUnique({
      where: {
        id: newCourses.id,
      },
      include: {
        preRequisite: {
          include: {
            prerequisite: true,
          },
        },
        preRequisiteFor: {
          include: {
            course: true,
          },
        },
      },
    });
    return result;
  }
  throw new ApiError(httpStatus.BAD_REQUEST, 'Unable to create course');
};
const deleteFromDb = async (id: string): Promise<Course> => {
  await prisma.courseToPrerequisite.deleteMany({
    where: {
      OR: [
        {
          courseId: id,
        },
        {
          preRequisiteId: id,
        },
      ],
    },
  });
  const result = await prisma.course.delete({
    where: {
      id,
    },
  });
  return result;
};
const assignFaculties = async (
  id: string,
  payload: string[]
): Promise<CourseFaculty[]> => {
  await prisma.courseFaculty.createMany({
    data: payload.map(facultyId => ({
      courseId: id,
      facultyId: facultyId,
    })),
  });
  const assignFacultiesData = await prisma.courseFaculty.findMany({
    where: {
      courseId: id,
    },
    include: {
      faculty: true,
    },
  });

  return assignFacultiesData;
};

const removeFaculties = async (id: string, payload: string[]):Promise<CourseFaculty[] | null > => {
  await prisma.courseFaculty.deleteMany({
    where: {
      courseId: id,
      facultyId: {
        in: payload,
      },
    },
  });
  const assignFacultiesData = await prisma.courseFaculty.findMany({
    where: {
      courseId: id,
    },
    include: {
      faculty: true,
    },
  });

  return assignFacultiesData;
};
export const CourseService = {
  insertIntoDb,
  getAllFromDb,
  getDataById,
  updateIntoDb,
  deleteFromDb,
  assignFaculties,
  removeFaculties,
};
