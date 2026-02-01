import { Country } from "@prisma/client";
import prisma from "../../../shared/prisma";

const createCountry = async (data: Country): Promise<Country> => {
  const result = await prisma.country.create({
    data
  });
  return result;
};

const getAllCountry = async (): Promise<Country[]> => {
  const result = await prisma.country.findMany();
  return result;
};

const updateCountry = async (id: string, country: Partial<Country>): Promise<Country> => {
  const result = await prisma.country.update({
    where: { id },
    data: country,
  });
  return result;
};

const deleteCountry = async (id: string): Promise<Country> => {
  const result = await prisma.country.delete({
    where: { id },
  });
  return result;
};

const getCountryById = async (id: string): Promise<Country | null> => {
  const result = await prisma.country.findUnique({
    where: { id },
  });
  return result;
};


export const CountryService = { createCountry, getAllCountry, updateCountry, deleteCountry, getCountryById };