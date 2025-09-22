
import { Sponsored } from "@prisma/client";
import prisma from "../../../shared/prisma";

const createSponsored = async (data: Sponsored): Promise<Sponsored> => {
  const result = await prisma.sponsored.create({
    data
  });
  return result;
};

const getAllSponsors = async (): Promise<Sponsored[]> => {
  const result = await prisma.sponsored.findMany();
  return result;
};

const updateSponsored = async (id: string, sponsored: Sponsored): Promise<Sponsored> => {
  const result = await prisma.sponsored.update({
    where: { id },
    data: sponsored,
  });
  return result;
};

const deleteSponsored = async (id: string): Promise<Sponsored> => {
  const result = await prisma.sponsored.delete({
    where: { id },
  });
  return result;
};

const getSponsoredById = async (id: string): Promise<Sponsored | null> => {
  const result = await prisma.sponsored.findUnique({
    where: { id },
  });
  return result;
};


export const SponsoredService = { createSponsored, getAllSponsors, updateSponsored, deleteSponsored, getSponsoredById };