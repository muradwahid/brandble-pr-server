import { Niche } from "@prisma/client";
import prisma from "../../../shared/prisma";

const createNiche = async (data: Niche): Promise<Niche> => {
  const result = await prisma.niche.create({
    data,
  });
  return result;
};

const getAllNiches = async (): Promise<Niche[]> => {
  const result = await prisma.niche.findMany();
  return result;
};

const updateNiche = async (id: string, data: Niche): Promise<Niche> => {
  const result = await prisma.niche.update({
    where: { id },
    data,
  });
  return result;
};

const deleteNiche = async (id: string): Promise<Niche> => {
  const result = await prisma.niche.delete({
    where: { id },
  });
  return result;
};

const getNicheById = async (id: string): Promise<Niche | null> => {
  const result = await prisma.niche.findUnique({
    where: { id },
  });
  return result;
};


export const NicheService = { createNiche, getAllNiches, updateNiche, deleteNiche, getNicheById };