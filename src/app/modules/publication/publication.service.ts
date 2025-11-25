import { Publication } from '@prisma/client';
import { startOfMonth, subMonths, format } from 'date-fns';
import { FileUploadHelper } from '../../../helpers/FileUploadHelper';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IUploadFile } from '../../../interfaces/file';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { publicationFilterableFields, publicationSearchableFields, publicationSortableFields } from './publication.constant';
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
// ) => {
//   const { page, limit, skip } = paginationHelpers.calculatePagination(options);

//   const {
//     searchTerm,
//     price = 'asc',
//     title = 'asc',
//     da = 'asc',
//     dr = 'asc',
//     genre = 'asc',
//     sponsor = 'asc',
//     ...filterData
//   } = filters;

//   const andConditions = new Array();
//   if (searchTerm) {
//     andConditions.push({
//       OR: publicationFilterableFields.map(field => ({
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

//   // Fixed: Create orderBy as an array of objects
//   const orderBy: any[] = [];

//   // Add additional sorting criteria only if they are explicitly provided
//   // and not just the default values
//   if (price && price !== 'asc') {
//     orderBy.push({ price });
//   }
//   if (title && title !== 'asc') {
//     orderBy.push({ title });
//   }
//   if (da && da !== 'asc') {
//     orderBy.push({ da });
//   }
//   if (dr && dr !== 'asc') {
//     orderBy.push({ dr });
//   }
//   if (genre && genre !== 'asc') {
//     orderBy.push({ genre });
//   }
//   if (sponsor && sponsor !== 'asc') {
//     orderBy.push({ sponsor });
//   }
//   if (filters?.location) {
//     orderBy.push({ location });
//   }
//   if (filters?.doFollow) {
//     orderBy.push({ doFollow: filters?.doFollow });
//   }
//   if (filterData?.index) {
//     orderBy.push({ index: filters?.index });
//   }

//   const whereConditions =
//     andConditions.length > 0 ? { AND: andConditions } : undefined;

//   const result = await prisma.$transaction(async (transactionClient) => {
//     const publication = await transactionClient.publication.findMany({
//       where: whereConditions,
//       skip,
//       take: limit,
//       orderBy,
//     });

//         const newPublication = await Promise.all(publication.map(async (publication) => {
//       const niches = await transactionClient.niche.findMany({
//         where: {
//           id: {
//             in: publication.niches
//           },
//         },
//       });
//       return {
//         ...publication,
//         niches
//       };
//     }));

//     return newPublication;

//   })


//   // const result = await prisma.publication.findMany({
//   //   where: whereConditions,
//   //   skip,
//   //   take: limit,
//   //   orderBy,
//   // });


//   // result.forEach(async (publication) => {
//   //   console.log(publication.niches)
//   //   const nicheDetails = await prisma.niche.findMany({
//   //     where: {
//   //       id: {
//   //         in: publication.niches
//   //       },
//   //     },
//   //   });
//   //   (publication as any).niches = nicheDetails;
//   // });




//   const total = await prisma.publication.count({
//     where: whereConditions,
//   });

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
  filters: IPublicationFilterableFields,
  options: IPaginationOptions,
) => {
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);

  const {
    searchTerm,
    niche,
    minPrice,
    maxPrice,
    sortBy: rawSortBy,
    sortOrder = 'desc',
    ...restFilters
  } = filters;

  const andConditions = [];

  // 1. Full-text search
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

  // 2. Price range
  if (minPrice || maxPrice) {
    andConditions.push({
      price: {
        ...(minPrice && { gte: String(minPrice) }),
        ...(maxPrice && { lte: String(maxPrice) }),
      },
    });
  }

  if (niche) {
    const matchingNiches = await prisma.niche.findMany({
      where: {
        title: {
          contains: niche,
          mode: 'insensitive',
        },
      },
      select: { id: true },
    });

    const nicheIds = matchingNiches.map(n => n.id);
    if (nicheIds.length === 0) {
      // No matching niche → return empty result early
      return {
        meta: { page, limit, total: 0, totalPage: 0 },
        data: [],
      };
    }

    andConditions.push({
      niches: {
        hasSome: nicheIds,
      },
    });
  }

  // 4. Other exact filters
  Object.keys(restFilters).forEach(key => {
    const value = restFilters[key];
    if (value !== undefined && value !== '') {
      if (key === 'doFollow') {
        andConditions.push({ doFollow: value});
      } else {
        andConditions.push({ [key]: value });
      }
    }
  });

  const whereConditions: any = andConditions.length > 0 ? { AND: andConditions } : {};

  const sortBy = publicationSortableFields.includes(rawSortBy as any)
    ? rawSortBy
    : 'createdAt';

  const orderBy = { [sortBy as string]: sortOrder };

  const [publications, total] = await prisma.$transaction([
    prisma.publication.findMany({
      where: whereConditions,
      skip,
      take: limit,
      orderBy,
      include: {
        favorites: true,
        orders:true,
      }
    }),
    prisma.publication.count({ where: whereConditions }),
  ]);

  const publicationsWithNiches = await Promise.all(
    publications.map(async pub => {
      if (!pub.niches || pub.niches.length === 0) {
        return { ...pub, niches: [] };
      }

      const niches = await prisma.niche.findMany({
        where: { id: { in: pub.niches as string[] } },
        select: { id: true, title: true },
      });

      return { ...pub, niches };
    }),
  );

  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit || 1),
    },
    data: publicationsWithNiches,
  };
};


// const getAllPublications = async (
//   filters: IPublicationFilterableFields,
//   options: IPaginationOptions,
// ) => {
//   const { page, limit, skip } = paginationHelpers.calculatePagination(options);

//   const {
//     searchTerm,
//     minPrice,
//     maxPrice,
//     sortBy: rawSortBy,
//     sortOrder = 'desc',
//     ...exactFilters
//   } = filters;

//   // === 1. Build WHERE conditions ===
//   const andConditions = [];

//   // Full-text search across multiple fields
//   if (searchTerm) {
//     andConditions.push({
//       OR: publicationSearchableFields.map(field => ({
//         [field]: {
//           contains: searchTerm,
//           mode: 'insensitive' as const,
//         },
//       })),
//     });
//   }

//   // Price range filter
//   if (minPrice || maxPrice) {
//     andConditions.push({
//       price: {
//         ...(minPrice && { gte: Number(minPrice) }),
//         ...(maxPrice && { lte: Number(maxPrice) }),
//       },
//     });
//   }

//   // Exact match filters (genre, doFollow, etc.)
//   const validFilterKeys = Object.keys(exactFilters).filter(key =>
//     publicationFilterableFields.includes(key as any),
//   );

//   if (validFilterKeys.length > 0) {
//     validFilterKeys.forEach(key => {
//       andConditions.push({
//         [key]: exactFilters[key],
//       });
//     });
//   }

//   const whereConditions =
//     andConditions.length > 0 ? { AND: andConditions as any } : {};

//   // === 2. Build ORDER BY ===
//   const validSortBy = publicationSortableFields.includes(rawSortBy as any)
//     ? rawSortBy
//     : 'createdAt';

//   const orderBy = {
//     [validSortBy as string]: sortOrder,
//   };

//   const [publications, total] = await prisma.$transaction([
//     prisma.publication.findMany({
//       where: whereConditions,
//       skip,
//       take: limit,
//       orderBy,
//       // include: {
//         // niches: {
//         //   select: {
//         //     id: true,
//         //     title: true,
//         //   },
//         // },
//       // }
//     }),

//     // Count total for pagination
//     prisma.publication.count({ where: whereConditions }),
//   ]);

//   const publicationsWithNiches = await Promise.all(
//     publications.map(async (pub) => {
//       if (!pub.niches || pub.niches.length === 0) {
//         return { ...pub, niches: [] };
//       }

//       const nicheDetails = await prisma.niche.findMany({
//         where: {
//           id: { in: pub.niches as string[] },
//         },
//         select: { id: true, title: true }
//       });

//       return {
//         ...pub,
//         niches: nicheDetails,
//       };
//     }),
//   );

//   return {
//     meta: {
//       page,
//       limit,
//       total,
//       totalPage: Math.ceil(total / limit),
//     },
//     data: publicationsWithNiches,
//   };
// };

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
    orderBy,
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



const getPublicationStatistics = async () => {
  const now = new Date();
  const thisMonth = startOfMonth(now);           // Nov 1, 2025
  const lastMonth = startOfMonth(subMonths(now, 1)); // Oct 1, 2025

  // Run both groupBy queries in parallel
  const [thisMonthStats, lastMonthStats] = await Promise.all([
    // This month: count orders + sum revenue
    prisma.order.groupBy({
      by: ['publicationId'],
      where: { createdAt: { gte: thisMonth } },
      _count: { id: true },
      _sum: { amount: true }, // your real field
    }),

    // Last month: only count orders
    prisma.order.groupBy({
      by: ['publicationId'],
      where: { createdAt: { gte: lastMonth, lt: thisMonth } },
      _count: { id: true },
    }),
  ]);

  // This month map: publicationId → { orders, revenue }
  const thisMonthMap = new Map<string, { orders: number; revenue: number }>();
  thisMonthStats.forEach((item) => {
    thisMonthMap.set(item.publicationId, {
      orders: item._count.id,
      revenue: item._sum.amount || 0,
    });
  });

  const lastMonthMap = new Map<string, number>();
  lastMonthStats.forEach((item) => {
    lastMonthMap.set(item.publicationId, item._count.id);
  });

  const allPublicationIds = new Set([
    ...thisMonthMap.keys(),
    ...lastMonthMap.keys(),
  ]);

  const publications = await prisma.publication.findMany({
    where: { id: { in: Array.from(allPublicationIds) } },
    select: { id: true, title: true },
  });

  const titleMap = new Map(publications.map((p) => [p.id, p.title]));

  const stats = Array.from(allPublicationIds).map((pubId) => {
    const thisMonthData = thisMonthMap.get(pubId) || { orders: 0, revenue: 0 };
    const lastMonthOrders = lastMonthMap.get(pubId) || 0;

    const growthRate = (() => {
      if (lastMonthOrders === 0) {
        return thisMonthData.orders > 0 ? '+100%' : '0%';
      }
      const rate = ((thisMonthData.orders - lastMonthOrders) / lastMonthOrders) * 100;
      const formatted = rate.toFixed(1);
      return rate > 0 ? `+${formatted}%` : `${formatted}%`;
    })();

    return {
      id: pubId,
      title: titleMap.get(pubId) || 'Unknown Publication',
      ordersThisMonth: thisMonthData.orders,
      ordersLastMonth: lastMonthOrders,
      growthRate, // e.g. "+25.0%", "-42.9%", "+100%", "0%"
      revenueThisMonth: Number(thisMonthData.revenue.toFixed(2)),
    };
  });

  stats.sort((a, b) => b.ordersThisMonth - a.ordersThisMonth);

  const totalThisMonth = stats.reduce((sum, p) => sum + p.ordersThisMonth, 0);
  const totalLastMonth = stats.reduce((sum, p) => sum + p.ordersLastMonth, 0);

  const totalGrowthRateRaw =
    totalLastMonth === 0
      ? totalThisMonth > 0
        ? 100
        : 0
      : ((totalThisMonth - totalLastMonth) / totalLastMonth) * 100;

  const totalGrowthRate =
    totalGrowthRateRaw > 0
      ? `+${totalGrowthRateRaw.toFixed(1)}%`
      : `${totalGrowthRateRaw.toFixed(1)}%`;

  return {
    summary: {
      totalOrdersThisMonth: totalThisMonth,
      totalGrowthRate, // e.g. "+18.5%", "-27.3%", "+100%", "0%"
      currentMonth: format(thisMonth, 'MMMM yyyy'),
      totalPublicationsWithOrders: stats.length,
    },
    publications: stats,
  };
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

  if (data?.niches) {
    data.niches = {
      set: JSON.parse(data.niches)
    }
  }
console.log("data : ",data);

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
  getPublicationStatistics
};
