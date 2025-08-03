import { z } from "zod";

const createDepartment = z.object({
  body: z.object({
    title: z.string({ required_error: 'title is required!' }),
    academicFacultyId:z.string({ required_error: 'academic faculty is required!' })
  }),
});
const updateDepartment = z.object({
  body: z.object({
    title: z.string().optional(),
    academicFacultyId:z.string().optional()
  }),
});

export const AcademicDepartmentZodValidation = {
  createDepartment,
  updateDepartment,
};