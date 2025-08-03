import { z } from "zod";

const createFaculty = z.object({
  body: z.object({
    title:z.string({required_error:'title is required'})
  })
})
const updateFaculty = z.object({
  body: z.object({
    title:z.string().optional()
  })
})
export const AcademicFacultyZodValidation = {
  createFaculty,
  updateFaculty
}