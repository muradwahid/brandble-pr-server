

import { DoFollow } from "@prisma/client";
import prisma from "../../../shared/prisma";

const createDoFollow = async (data: DoFollow): Promise<DoFollow> => {
  const result = await prisma.indexed.create({
    data
  });
  return result;
};

const getAllDoFollow = async (): Promise<DoFollow[]> => {
  const result = await prisma.indexed.findMany();
  return result;
};

const updateDoFollow = async (id: string, indexed: DoFollow): Promise<DoFollow> => {
  const result = await prisma.indexed.update({
    where: { id },
    data: indexed,
  });
  return result;
};

const deleteDoFollow = async (id: string): Promise<DoFollow> => {
  const result = await prisma.indexed.delete({
    where: { id },
  });
  return result;
};

const getDoFollowById = async (id: string): Promise<DoFollow | null> => {
  const result = await prisma.indexed.findUnique({
    where: { id },
  });
  return result;
};


export const DoFollowService = { createDoFollow, getAllDoFollow, updateDoFollow, deleteDoFollow, getDoFollowById };