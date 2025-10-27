import { Genre } from "@prisma/client";
import prisma from "../../../shared/prisma";

const createGenre = async (data: Genre): Promise<Genre> => {
  const result = await prisma.genre.create({
    data
  });
  return result;
};

const getAllGenres = async (): Promise<Genre[]> => {
  const result = await prisma.genre.findMany();
  return result;
};

const updateGenre = async (id: string, genre: Genre): Promise<Genre> => {
  const result = await prisma.genre.update({
    where: { id },
    data: genre,
  });
  return result;
};

const deleteGenre = async (id: string): Promise<Genre> => {
  const result = await prisma.genre.delete({
    where: { id },
  });
  return result;
};

const getGenreById = async (id: string): Promise<Genre | null> => {
  const result = await prisma.genre.findUnique({
    where: { id },
  });
  return result;
};


export default { createGenre, getAllGenres, updateGenre, deleteGenre, getGenreById };