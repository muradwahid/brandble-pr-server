import { Publication } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { publicationSearchableFields } from './publication.constant';
import { IPublicationFilterableFields } from './publication.interface';

const createPublication = async (
  data: Publication,
): Promise<Publication | null> => {
  const result = await prisma.publication.create({
    data,
  });
  return result;
};

// const getAllPublications = async (
//   filters: IPublicationFilterableFields | any,
//   options: IPaginationOptions | any,
// ): Promise<IGenericResponse<Partial<Publication>[]>> => {
//   const { page, limit, skip } = paginationHelpers.calculatePagination(options);
//   const {
//     searchTerm,
//     price = 'asc',
//     title = 'asc',
//     da = 'asc',
//     dr = 'asc',
//     ...filterData
//   } = filters;
//   const andConditions = new Array();
//   if (searchTerm) {
//     andConditions.push({
//       OR: publicationSearchableFields.map(field => ({
//         [field]: {
//           contains: searchTerm,
//           mode: 'insensitive',
//         },
//       })),
//     });
//   }
//   const filterKeys = Object.keys(filterData);
//   if (filterKeys.length > 0) {
//     andConditions.push({
//       AND: filterKeys.map(key => {
//         return {
//           [key]: {
//             equals: (filterData as any)[key],
//           },
//         };
//       }),
//     });
//   }
//   const orderBy: any = {
//     createdAt: 'desc',
//   };
//   if (price) {
//     orderBy.price = price;
//   }
//   if (title) {
//     orderBy.title = title;
//   }
//   if (da) {
//     orderBy.da = da;
//   }
//   if (dr) {
//     orderBy.dr = dr;
//   }
//   const whereConditions =
//     andConditions.length > 0 ? (andConditions as any) : undefined;
//   const result = await prisma.publication.findMany({
//     where: whereConditions,
//     skip,
//     take: limit,
//     orderBy,
//   });
//   const total = await prisma.publication.count();
//   return {
//     meta: {
//       page,
//       limit,
//       total,
//     },
//     data: result,
//   };
// };

const getAllPublications = async (
  filters: IPublicationFilterableFields | any,
  options: IPaginationOptions | any,
): Promise<IGenericResponse<Partial<Publication>[]>> => {
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);
  const {
    searchTerm,
    price = 'asc',
    title = 'asc',
    da = 'asc',
    dr = 'asc',
    ...filterData
  } = filters;

  const andConditions = new Array();

  if (searchTerm) {
    andConditions.push({
      OR: publicationSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  const filterKeys = Object.keys(filterData);
  if (filterKeys.length > 0) {
    andConditions.push({
      AND: filterKeys.map(key => {
        return {
          [key]: {
            equals: (filterData as any)[key],
          },
        };
      }),
    });
  }

  // Fixed: Create orderBy as an array of objects
  const orderBy: any[] = [
    { createdAt: 'desc' }, // Default sorting
  ];

  // Add additional sorting criteria only if they are explicitly provided
  // and not just the default values
  if (price && price !== 'asc') {
    orderBy.push({ price });
  }
  if (title && title !== 'asc') {
    orderBy.push({ title });
  }
  if (da && da !== 'asc') {
    orderBy.push({ da });
  }
  if (dr && dr !== 'asc') {
    orderBy.push({ dr });
  }

  const whereConditions =
    andConditions.length > 0 ? { AND: andConditions } : undefined;

  const result = await prisma.publication.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy, // Now this is an array as expected by Prisma
    include: {
      niche: true,
      genre:true
    }
  });

  const total = await prisma.publication.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};
const getPublicationById = async (id: string): Promise<Publication | null> => {
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

const deletePublication = async (id: string): Promise<Publication | null> => {
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
