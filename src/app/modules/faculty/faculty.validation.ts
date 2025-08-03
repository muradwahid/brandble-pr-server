import { z } from "zod";

const createFaculty=z.object({
  body:z.object({
    facultyId: z.string({ required_error: 'facultyId is required' }),
    firstName: z.string({ required_error: 'firstName is required' }),
    middleName: z.string({ required_error: 'middleName is required' }),
    lastName: z.string({ required_error: 'lastName is required' }),
    profileImage: z.string({ required_error: 'profileImage is required' }),
    email: z.string({ required_error: 'email is required' }),
    contactNo: z.string({ required_error: 'contactNo is required' }),
    gender: z.string({ required_error: 'gender is required' }),
    bloodgroup: z.string({ required_error: 'bloodgroup is required' }),
    designation: z.string({ required_error: 'designation is required' }),
    academicFacultyId: z.string({ required_error: 'academicFacultyId is required' }),
    academicDepartmentId: z.string({ required_error: 'academicDepartmentId is required' }),
  })
})
const updateFaculty = z.object({
  body: z.object({
    facultyId: z.string().optional(),
    firstName: z.string().optional(),
    middleName: z.string().optional(),
    lastName: z.string().optional(),
    profileImage: z.string().optional(),
    email: z.string().optional(),
    contactNo: z.string().optional(),
    gender: z.string().optional(),
    bloodgroup: z.string().optional(),
    designation: z.string().optional(),
    academicFacultyId: z.string().optional(),
    academicDepartmentId: z.string().optional(),
  }),
});
const courseFacultyAddRemove = z.object({
  body: z.object({
    faculties: z.array(z.string()),
  }),
});
export const FacultyZodValidation = {
  createFaculty,
  updateFaculty,
  courseFacultyAddRemove,
};