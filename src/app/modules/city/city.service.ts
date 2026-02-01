import { City } from "@prisma/client";
import prisma from "../../../shared/prisma";

const createCity = async (data: City): Promise<City> => {
  const result = await prisma.city.create({
    data
  });
  return result;
};

const getAllCity = async (): Promise<City[]> => {
  const result = await prisma.city.findMany();
  return result;
};

const updateCity = async (id: string, city: Partial<City>): Promise<City> => {
  const result = await prisma.city.update({
    where: { id },
    data: city,
  });
  return result;
};

const deleteCity = async (id: string): Promise<City> => {
  const result = await prisma.city.delete({
    where: { id },
  });
  return result;
};

const getCityById = async (id: string): Promise<City | null> => {
  const result = await prisma.city.findUnique({
    where: { id },
  });
  return result;
};


export const CityService = { createCity, getAllCity, updateCity, deleteCity, getCityById };