import { WonArticle } from '@prisma/client';
import prisma from '../../../shared/prisma';

export const createWonArticle = async (
  data: WonArticle,
): Promise<WonArticle> => {
  const result = await prisma.wonArticle.create({
    data,
  });
  return result;
};

export const getAllWonArticles = async (): Promise<WonArticle[]> => {
  const result = await prisma.wonArticle.findMany();
  return result;
};

export const getWonArticleById = async (id: string): Promise<WonArticle | null> => {
  const result = await prisma.wonArticle.findUnique({
    where: { id },
  });

  return result;
};

export const updateWonArticle = async (id: string, data: WonArticle): Promise<Partial<WonArticle>> => {
  const result = await prisma.wonArticle.update({
    where: { id },
    data,
  });
  return result;
};

export const deleteWonArticle = async (id: string): Promise<Partial<WonArticle>> => {
  const result = await prisma.wonArticle.delete({
    where: { id },
  });
  return result;
};

export const getWonArticleByPublicationId = async (publicationId: string): Promise<WonArticle[]> => {
  const result = await prisma.wonArticle.findMany({
    where: { orders: { some: { publicationId } } },
  });
  return result;
};

export const WonArticleService = {
  createWonArticle,
  getAllWonArticles,
  getWonArticleById,
  updateWonArticle,
  deleteWonArticle,
  getWonArticleByPublicationId,
};
