import { WriteArticle } from "@prisma/client";
import prisma from "../../../shared/prisma";

const createWriteArticle = async (data: WriteArticle): Promise<WriteArticle> => {
  const result = await prisma.writeArticle.create({
    data,
  });
  return result;
};

const getAllWriteArticles = async (): Promise<WriteArticle[]> => {
  const result = await prisma.writeArticle.findMany();
  return result;
};

const getWriteArticleById = async (id: string): Promise<WriteArticle | null> => {
  const result = await prisma.writeArticle.findUnique({
    where: { id },
  });
  return result;
};

const updateWriteArticle = async (id: string, data: Partial<WriteArticle>): Promise<Partial<WriteArticle>> => {
  const result = await prisma.writeArticle.update({
    where: { id },
    data,
  });
  return result;
};

const deleteWriteArticle = async (id: string): Promise<Partial<WriteArticle>> => {
  const result = await prisma.writeArticle.delete({
    where: { id },
  });
  return result;
};

export const WriteArticleService = {
  createWriteArticle,
  getAllWriteArticles,
  getWriteArticleById,
  updateWriteArticle,
  deleteWriteArticle,
};