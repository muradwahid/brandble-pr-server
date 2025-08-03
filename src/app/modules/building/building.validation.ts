import { z } from "zod";

const createBuilding = z.object({
  body: z.object({
    title: z.string({ required_error: 'title is required' }),
  }),
});
const updateBuilding = z.object({
  body: z.object({
    title: z.string().optional(),
  }),
});
export const BuildingZodValidation = {
  createBuilding,
  updateBuilding,
};