import { Prisma, WriteArticle } from "@prisma/client";
import httpStatus from 'http-status';
import { FileUploadHelper } from "../../../helpers/FileUploadHelper";
import { IUploadFile } from "../../../interfaces/file";
import prisma from "../../../shared/prisma";
import { CustomRequest } from "./writeArticle.interface";
import ApiError from "../../../errors/ApiError";

const createWriteArticle = async (req: CustomRequest) => {
  try {
    const files = req.files as IUploadFile[] | undefined;
    
    // Parse request data first
    let data: any = {};
    try {
      data = typeof req.body === 'string' ? JSON.parse(req.body) : { ...req.body };
    } catch (parseError) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid JSON data in request body");
    }

    let uploadedFiles: Array<{ [key: string]: string }> = [];

    // Only process files if they exist
    if (files && Array.isArray(files) && files.length > 0) {

      // Upload files to Cloudinary with individual error handling
      const fileUploadPromises = files.map(async (file) => {
        try {
          const uploadedFile = await FileUploadHelper.uploadPdfToCloudinary(file);
          
          if (!uploadedFile || !uploadedFile.secure_url) {
            throw new Error(`Cloudinary upload failed for ${file.fieldname}`);
          }
          
          return {
            [file.fieldname]: uploadedFile.secure_url
          };
        } catch (error) {
          console.error(`File upload failed for ${file.fieldname}:`, error);
          throw new ApiError(
            httpStatus.BAD_REQUEST, 
            `Failed to upload ${file.fieldname}: ${(error as Error).message}`
          );
        }
      });

      uploadedFiles = await Promise.all(fileUploadPromises);
    }

    // Merge uploaded files data if any files were uploaded
    if (uploadedFiles.length > 0) {
      Object.assign(data, ...uploadedFiles);
    }

    // Create article in database
    const result = await prisma.writeArticle.create({
      data,
    });

    if (!result) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to create article in database");
    }

    return result;

  } catch (error) {
    // Handle specific error types
    if (error instanceof ApiError) {
      throw error;
    }

    // Handle Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
          throw new ApiError(httpStatus.CONFLICT, "Article with similar data already exists");
        case 'P2003':
          throw new ApiError(httpStatus.BAD_REQUEST, "Invalid foreign key reference");
        case 'P2025':
          throw new ApiError(httpStatus.NOT_FOUND, "Related record not found");
        default:
          console.error('Prisma error:', error);
          throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Database operation failed");
      }
    }

    // Handle other Prisma errors
    if (error instanceof Prisma.PrismaClientUnknownRequestError || 
        error instanceof Prisma.PrismaClientInitializationError ||
        error instanceof Prisma.PrismaClientValidationError) {
      console.error('Prisma error:', error);
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Database error occurred");
    }

    // Generic error handling
    console.error('Unexpected error in createWriteArticle:', error);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR, 
      "Unable to create article due to an unexpected error"
    );
  }
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