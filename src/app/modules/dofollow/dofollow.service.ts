

import { DoFollow } from "@prisma/client";
import prisma from "../../../shared/prisma";

const createDoFollow = async (data: DoFollow): Promise<DoFollow> => {
  const result = await prisma.doFollow.create({
    data
  });
  return result;
};

const getAllDoFollow = async (): Promise<DoFollow[]> => {
  const result = await prisma.doFollow.findMany();
  return result;
};

const updateDoFollow = async (id: string, doFollow: DoFollow): Promise<DoFollow> => {
  const result = await prisma.doFollow.update({
    where: { id },
    data: doFollow,
  });
  return result;
};

const deleteDoFollow = async (id: string): Promise<DoFollow> => {
  const result = await prisma.doFollow.delete({
    where: { id },
  });
  return result;
};

const getDoFollowById = async (id: string): Promise<DoFollow | null> => {
  const result = await prisma.doFollow.findUnique({
    where: { id },
  });
  return result;
};


export const DoFollowService = { createDoFollow, getAllDoFollow, updateDoFollow, deleteDoFollow, getDoFollowById };