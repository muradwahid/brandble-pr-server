import { z } from "zod";
const createSemesterRegistration=z.object({
  body: z.object({
    startDate: z.string({ required_error: 'startDate is required' }),
    endDate: z.string({ required_error: 'endDate is required' }),
    status: z.string().optional(),
    minCredit: z.number({ required_error: 'minCredit is required' }),
    maxCredit: z.number({ required_error: 'maxCredit is required' }),
    academicSemesterId: z.number({ required_error: 'academicSemesterId is required' })
  })
})
const updateSemesterRegistration=z.object({
  body: z.object({
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    status: z.string().optional(),
    minCredit: z.number().optional(),
    maxCredit: z.number().optional(),
    academicSemesterId: z.enum(["UPCOMING","ONGOING","ENDED"] as [string,...string[]],{}).optional(),
  })
})

export const SemesterRegistrationZodValidation = {
  createSemesterRegistration,
  updateSemesterRegistration,
};