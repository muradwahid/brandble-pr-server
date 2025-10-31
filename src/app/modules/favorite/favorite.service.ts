import bcrypt from "bcrypt";
import httpStatus from "http-status";
import { Secret } from "jsonwebtoken";
import config from "../../../config";
import ApiError from "../../../errors/ApiError";
import { FileUploadHelper } from "../../../helpers/FileUploadHelper";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import { IUploadFile } from "../../../interfaces/file";
import prisma from "../../../shared/prisma";

const allFavorites = async (userId: string): Promise<any[] | null> => {
  const result = await prisma.favorite.findMany({
    where: { userId: userId }
  });
    return result;
}

const createFavorite = async (data: any): Promise<any> => {
  const result = await prisma.favorite.create({
    data: data
  });
  return result;
}

const deleteFavorite = async (id: string): Promise<any> => {
  const result = await prisma.favorite.delete({
    where: { id: id }
  });
  return result;
}


export const FavoriteService = {
  allFavorites,
  createFavorite,
  deleteFavorite,
}