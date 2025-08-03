import { z } from 'zod';

const createCourse = z.object({
  body: z.object({
    title: z.string({ required_error: 'title is required' }),
    code: z.string({ required_error: 'code is required' }),
    credits: z.number({ required_error: 'credits is required' }),
    preRequisiteCourses: z.array(z.string()).optional(),
  }),
});
const updateCourse = z.object({
  body: z.object({
    title: z.string().optional(),
    code: z.string().optional(),
    credits: z.number().optional(),
    preRequisiteCourses: z
      .array(
        z.object({
          courseId: z.string().optional(),
          isDeleted: z.boolean().optional(),
        })
      )
      .optional(),
  }),
});
const courseFacultyAddRemove = z.object({
  body: z.object({
    faculties: z.array(z.string()),
  }),
});
export const CourseZodValidation = {
  createCourse,
  updateCourse,
  courseFacultyAddRemove,
};
