import { Service } from "@prisma/client";
import prisma from "../../../shared/prisma";

const createService = async (data: Service): Promise<Service> => {
  const result = await prisma.service.create({
    data,
  });
  return result;
};

const getAllServices = async (): Promise<Service[]> => {
  const result = await prisma.service.findMany();
  return result;
};

const getServiceById = async (id: string): Promise<Service | null> => {
  const result = await prisma.service.findUnique({
    where: { id },
  });
  return result;
};

const updateService = async (id: string, data: Partial<Service>): Promise<Partial<Service>> => {

  const result = await prisma.service.update({
    where: { id },
    data,
  });
  return result;
};

const deleteService = async (id: string): Promise<Partial<Service>> => {

  const result = await prisma.service.delete({
    where: { id },
  });
  return result;
};

export const ServiceService = {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
};