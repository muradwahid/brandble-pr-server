import { Indexed } from "@prisma/client";
import prisma from "../../../shared/prisma";

const createIndexed = async (data: Indexed): Promise<Indexed> => {
  const result = await prisma.indexed.create({
    data
  });
  return result;
};

const getAllIndexes = async (): Promise<Indexed[]> => {
  const result = await prisma.indexed.findMany();
  return result;
};

const updateIndexed = async (id: string, indexed: Indexed): Promise<Indexed> => {
  const result = await prisma.indexed.update({
    where: { id },
    data: indexed,
  });
  return result;
};

const deleteIndexed = async (id: string): Promise<Indexed> => {
  const result = await prisma.indexed.delete({
    where: { id },
  });
  return result;
};

const getIndexedById = async (id: string): Promise<Indexed | null> => {
  const result = await prisma.indexed.findUnique({
    where: { id },
  });
  return result;
};


export const IndexedService = { createIndexed, getAllIndexes, updateIndexed, deleteIndexed, getIndexedById };