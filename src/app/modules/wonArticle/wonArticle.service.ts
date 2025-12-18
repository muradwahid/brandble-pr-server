import { WonArticle } from '@prisma/client';
import { FileUploadHelper } from '../../../helpers/FileUploadHelper';
import { IUploadFile } from '../../../interfaces/file';
import prisma from '../../../shared/prisma';
import { WonArticleCustomRequest } from './wonArticle.interface';

export const createWonArticle = async (req:WonArticleCustomRequest) => {

  const files = req.files as IUploadFile[];
  const fileUploadPromises = files.map(async (file) => {
    const uploadedFile = await FileUploadHelper.uploadPdfToCloudinary(file);
    return uploadedFile?.secure_url;
  });

  const uploadedFiles = await Promise.all(fileUploadPromises);

  const data = {...req.body}
  if (uploadedFiles) {
    data.file = JSON.stringify(uploadedFiles);
  }

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
    where: {
      orders: {
        some: {
          publicationId: publicationId
        }
      }
    },
    include: {
      orders: {
        where: { publicationId: publicationId }
      }
    }
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
