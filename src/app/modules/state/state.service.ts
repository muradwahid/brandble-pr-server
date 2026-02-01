import { State } from "@prisma/client";
import prisma from "../../../shared/prisma";

const createState = async (data: State): Promise<State> => {
  const result = await prisma.state.create({
    data
  });
  return result;
};

const getAllState = async (): Promise<State[]> => {
  const result = await prisma.state.findMany();
  return result;
};

const updateState = async (id: string, state: Partial<State>): Promise<State> => {
  const result = await prisma.state.update({
    where: { id },
    data: state,
  });
  return result;
};

const deleteState = async (id: string): Promise<State> => {
  const result = await prisma.state.delete({
    where: { id },
  });
  return result;
};

const getStateById = async (id: string): Promise<State | null> => {
  const result = await prisma.state.findUnique({
    where: { id },
  });
  return result;
};


export const StateService = { createState, getAllState, updateState, deleteState, getStateById };