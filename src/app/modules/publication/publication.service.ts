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
  const { countries, states, cities, niches, ...restData } = data;

  if (uploadedProfileImage && uploadedProfileImage.secure_url) {
    restData.logo = uploadedProfileImage.secure_url;
  }

  const result = await prisma.publication.create({
    data: {
      ...restData,
      niches: {
        connect: niches?.map((id: string) => ({ id })) || [],
      },
      countries: {
        connect: countries?.map((id: string) => ({ id })) || [],
      },
      states: {
        connect: states?.map((id: string) => ({ id })) || [],
      },
      cities: {
        connect: cities?.map((id: string) => ({ id })) || [],
      },
    },
    include: {
      countries: true,
      states: true,
      cities: true,
      niches:true
    },
  });

  return result;
};


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
    countries,
    states,
    cities,
    sortBy: rawSortBy,
    sortOrder = 'desc',
    ...restFilters
  } = filters;

  const andConditions = [];


  
  const countryList = countries?.split(',').map((item: string) => item.trim()).filter(Boolean);
  const stateList = states?.split(',').map((item: string) => item.trim()).filter(Boolean);
  const cityList = cities?.split(',').map((item: string) => item.trim()).filter(Boolean);

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
    andConditions.push({
      niches: {
        some: {
          title: {
            contains: niche,
            mode: 'insensitive', 
          },
        },
      },
    });
  }
  if (countryList?.length) {
    andConditions.push({
      countries: {
        some: {
          name: {
            in: countryList
          },
        },
      },
    });
  }

  if (stateList?.length) {
    andConditions.push({
      states: {
        some: {
          name: {
            in: stateList,
          },
        },
      },
    });
  }

  if (cityList?.length) {
    andConditions.push({
      cities: {
        some: {
          name: {
            in: cityList,
          },
        },
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

  const result = await prisma.publication.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy,
    include: {
      favorites: true,
      orders: true,
      niches:true,
      countries:true,
      states:true,
      cities:true
    }
  });


  const total = await prisma.publication.count({ where: whereConditions });

  const totalPublications = await prisma.publication.count();


  return {
    meta: {
      page,
      limit,
      total: totalPublications,
      totalPage:  total === 0 ? 0 : Math.ceil(total / limit)
    },
    data: result,
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

const getSearchPublications = async (filters:any) => { 
  const { searchTerm } = filters;
  const andConditions = [];

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

  const whereConditions: any = andConditions.length > 0 ? { AND: andConditions } : {};
 const result = await prisma.publication.findMany({
    where: whereConditions
 })
  return result;
}

const getPublicationById = async (id: string): Promise<Publication | null> => {
    const result = await prisma.publication.findUnique({
      where: {
        id,
      },
      include: {
        niches:true,
        countries:true,
        states:true,
        cities:true
      }

    });

    return result;
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
  const relationalFields = ['countries', 'states', 'cities', 'niches'];

  relationalFields.forEach((field) => {
    if (data[field]) {
      try {
        const ids = typeof data[field] === 'string' ? JSON.parse(data[field]) : data[field];

        data[field] = {
          set: ids.map((id: string) => ({ id }))
        };
      } catch (e) {
        delete data[field]; 
      }
    }
  });

  try {
    const result = await prisma.publication.update({
      where: { id },
      data,
      include: {
        countries: true,
        states: true,
        cities: true,
        niches: true
      }
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
  getSearchPublications,
  getPublicationById,
  updatePublication,
  deletePublication,
  getPublicationStatistics
};
