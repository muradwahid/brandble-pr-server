import { Niche, Publication } from '@prisma/client';
import { FileUploadHelper } from '../../../helpers/FileUploadHelper';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IUploadFile } from '../../../interfaces/file';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { publicationSearchableFields } from './publication.constant';
import { IPublicationFilterableFields } from './publication.interface';


interface CustomRequest {
  body: any;
  file?: IUploadFile;
}

const createPublication = async (
  req: CustomRequest,
) => {
  const file = req.file as IUploadFile;

  const uploadedProfileImage = await FileUploadHelper.uploadToCloudinary(file);
  const data = { ...req.body };
  if (uploadedProfileImage && uploadedProfileImage.secure_url) {
    data.logo = uploadedProfileImage.secure_url;
  }
  //   if (uploadedProfileImage) {
  //       req.body..profileImage = uploadedProfileImage.secure_url;
  //   }


  const result = await prisma.publication.create({
    data
  });

  //   const niches = await prisma.niche.findMany({
  //   where: {
  //     id: {
  //       in: ["2a085369-75b3-45df-968c-f193eac2372d", "55e8c434-1f77-4db7-aa5f-6ee0ba56cdc0"]
  //     }
  //   }
  // });

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
) => {
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);

  const {
    searchTerm,
    price = 'asc',
    title = 'asc',
    da = 'asc',
    dr = 'asc',
    genre = 'asc',
    sponsor = 'asc',
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
  const orderBy: any[] = [];

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
  if (genre && genre !== 'asc') {
    orderBy.push({ genre });
  }
  if (sponsor && sponsor !== 'asc') {
    orderBy.push({ sponsor });
  }

  const whereConditions =
    andConditions.length > 0 ? { AND: andConditions } : undefined;


  const result = await prisma.$transaction(async (transactionClient) => {
    const publication = await transactionClient.publication.findMany({
      where: whereConditions,
      skip,
      take: limit,
      orderBy,
    });

        const newPublication = await Promise.all(publication.map(async (publication) => {
      const niches = await transactionClient.niche.findMany({
        where: {
          id: {
            in: publication.niches
          },
        },
      });
      return {
        ...publication,
        niches
      };
    }));

    return newPublication;

  })


  // const result = await prisma.publication.findMany({
  //   where: whereConditions,
  //   skip,
  //   take: limit,
  //   orderBy,
  // });


  // result.forEach(async (publication) => {
  //   console.log(publication.niches)
  //   const nicheDetails = await prisma.niche.findMany({
  //     where: {
  //       id: {
  //         in: publication.niches
  //       },
  //     },
  //   });
  //   (publication as any).niches = nicheDetails;
  // });




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

const getAllPublicationssss = async (
  filters: IPublicationFilterableFields | any,
  options: IPaginationOptions | any,
) => {
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);
  const {
    searchTerm,
    ...filterData
  } = filters;

  // ✅ CORRECT: Use values directly without defaults
  const sortBy = options.sortBy; // No default
  const sortOrder = options.sortOrder; // No default
  // DEBUG: More detailed logging

  const andConditions: any[] = [];

  // ... (search and filter conditions remain same)

  // FIXED: Simplified and corrected orderBy logic
  let orderBy: any = { createdAt: 'desc' }; // Default fallback

  if (sortBy && sortOrder) {

    if (sortBy === 'title') {
      orderBy = { title: sortOrder };
    }
    else if (sortBy === 'price') {
      orderBy = { price: sortOrder };
    }
    else if (sortBy === 'da') {
      orderBy = { da: sortOrder };
    }
    else if (sortBy === 'dr') {
      orderBy = { dr: sortOrder };
    }
    else if (sortBy === 'createdAt') {
      orderBy = { createdAt: sortOrder };
    }
    else if (sortBy === 'updatedAt') {
      orderBy = { updatedAt: sortOrder };
    }
    else if (sortBy === 'genre') {
      orderBy = { genre: { title: sortOrder } };
    }
    else if (sortBy === 'sponsored') {
      orderBy = { sponsored: { title: sortOrder } };
    }
    else if (sortBy === 'doFollow') {
      orderBy = { doFollow: { title: sortOrder } };
    }
    else if (sortBy === 'index') {
      orderBy = { index: { title: sortOrder } };
    }
  } 


  const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};

  // Fetch publications
  const result = await prisma.publication.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy, // This should now work correctly
  });


  // If using array field for nicheIds instead of relation
  const publicationsWithNiches = await Promise.all(
    result.map(async (publication) => {
      if (publication.niches && publication.niches.length > 0) {
        const nicheDetails = await prisma.niche.findMany({
          where: {
            id: {
              in: publication.niches
            },
          },
        });
        return {
          ...publication,
          niches: nicheDetails
        };
      }
      return publication;
    })
  );

  const total = await prisma.publication.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: publicationsWithNiches,
  };
};
const getPublicationById = async (id: string): Promise<Publication | null> => {
  try {
    const result = await prisma.publication.findUnique({
      where: {
        id,
      },

    });


    if (result?.niches) {
      const nicheDetails = await prisma.niche.findMany({
        where: {
          id: {
            in: result?.niches
          }
        }
      });
      (result as any).niches = nicheDetails;
    }

    return result;
  } catch (error) {
    throw error;
  }
};

const updatePublication = async (
  id: string,
  req: CustomRequest,
) => {


  const file = req.file as IUploadFile;
  const data = { ...req.body };

  if (file) {
    const uploadedProfileImage = await FileUploadHelper.uploadToCloudinary(file);
    if (uploadedProfileImage && uploadedProfileImage.secure_url) {
      data.logo = uploadedProfileImage.secure_url;
    }

  }


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
