import { z } from "zod";
const createRoom = z.object({
  body: z.object({
    romNumber: z.string({ required_error: 'room number is required' }),
    floor: z.string({ required_error: 'floor number is required' }),
    buildingId:z.string({ required_error: 'buildingId is required' })
  })
})
const updateRoom = z.object({
  body: z.object({
    romNumber: z.string().optional(),
    floor: z.string().optional(),
    buildingId:z.string().optional()
  })
})
export const RoomZodValidation = {
  createRoom,
  updateRoom
}