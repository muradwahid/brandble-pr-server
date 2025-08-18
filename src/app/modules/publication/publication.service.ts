import { Publication } from "@prisma/client";
import prisma from "../../../shared/prisma";


const createPublication = async (data: Publication):Promise<Publication | null> => {
    const result = await prisma.publication.create({
      data,
    });
  return result;
};

const getAllPublications = async (): Promise<Publication[] | null> => {
  
  const result = await prisma.publication.findMany({});
  return result;
};

const getPublicationById = async (id: string):Promise<Publication | null> => {
    try {
        const result = await prisma.publication.findUnique({
            where: {
                id,
            },
        });
        return result;
    } catch (error) {
        throw error;
    }
  
};

const updatePublication = async (
  id: string,
  data: Partial<Publication>,
): Promise<Publication | null> => {
  try {
    const result = await prisma.publication.update({
      where: {
        id,
    },
    data,
    });
    return result;
  } catch (error) {
    throw error;
  }
};

const deletePublication = async (id: string):Promise<Publication | null> => {
  try {
    const result = await prisma.publication.delete({
      where: {
        id,
    },
    });
    return result;
  } catch (error) {
    throw error;
  }
};




export const PublicationService = {
  createPublication,
  getAllPublications,
  getPublicationById,
  updatePublication,
  deletePublication,
};
