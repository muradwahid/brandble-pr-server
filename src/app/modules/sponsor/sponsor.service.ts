
import { Sponsored } from "@prisma/client";
import prisma from "../../../shared/prisma";

const createSponsored = async (data: Sponsored): Promise<Sponsored> => {
  const result = await prisma.indexed.create({
    data
  });
  return result;
};

const getAllSponsors = async (): Promise<Sponsored[]> => {
  const result = await prisma.indexed.findMany();
  return result;
};

const updateSponsored = async (id: string, indexed: Sponsored): Promise<Sponsored> => {
  const result = await prisma.indexed.update({
    where: { id },
    data: indexed,
  });
  return result;
};

const deleteSponsored = async (id: string): Promise<Sponsored> => {
  const result = await prisma.indexed.delete({
    where: { id },
  });
  return result;
};

const getSponsoredById = async (id: string): Promise<Sponsored | null> => {
  const result = await prisma.indexed.findUnique({
    where: { id },
  });
  return result;
};


export const SponsoredService = { createSponsored, getAllSponsors, updateSponsored, deleteSponsored, getSponsoredById };