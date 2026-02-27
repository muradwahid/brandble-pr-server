import { Publication } from '@prisma/client';
import { Workbook } from 'exceljs';
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

  const parseToArray = (field: any) => {
    if (!field || field === "") return []; 
    if (typeof field === "string") {
      try {
        return JSON.parse(field);
      } catch (e) {
        return [];
      }
    }
    return Array.isArray(field) ? field : [];
  };

  const parsedNiches = parseToArray(niches);

  const result = await prisma.publication.create({
    data: {
      ...restData,
      niches: {
        connect: parsedNiches.map((id:any) => ({ id })),
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
    sortOrder,
    title = 'asc',
    da,
    dr,
    scope,
    ...restFilters
  } = filters;

  const andConditions = [];
  
  const countryList = countries?.split(',').map((item: string) => item.trim()).filter(Boolean);
  const stateList = states?.split(',').map((item: string) => item.trim()).filter(Boolean);
  const cityList = cities?.split(',').map((item: string) => item.trim()).filter(Boolean);
  const scopeList = scope?.split(',').map((item: string) => item.trim()).filter(Boolean);

  const priceMin = minPrice ? parseFloat(minPrice) : undefined;
  const priceMax = maxPrice ? parseFloat(maxPrice) : undefined;

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
        ...(priceMin !== undefined ? { gte: priceMin } : {}),
        ...(priceMax !== undefined ? { lte: priceMax } : {}),
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
  if (scopeList?.length) {
    andConditions.push({
      scope: {
        in: scopeList,
        mode:'insensitive'
      }
    });
  }

  // 4. Other exact filters
  Object.keys(restFilters).forEach(key => {
    const value = restFilters[key];
    if (value !== undefined && value !== '') {
      if (key === 'doFollow') {
        andConditions.push({ doFollow: {contains:value, mode: 'insensitive'} });
      } else {
        andConditions.push({ [key]: {contains:value, mode: 'insensitive'} });
      }
    }
  });

  const whereConditions: any = andConditions.length > 0 ? { AND: andConditions } : {};

  // const sortBy = publicationSortableFields.includes(rawSortBy as any)
    // ? rawSortBy
    // : 'createdAt';

  // const orderBy:any = { title: 'asc' };

  // const orderBy: any[] = [{ [sortBy as string]: sortOrder }, { title: title as string }];

  const orderBy: any[] = [];

  if (rawSortBy && publicationSortableFields.includes(rawSortBy as any)) {
    const direction = sortOrder === 'desc' ? 'desc' : 'asc';
    orderBy.push({ [rawSortBy as any]: direction });
  }

  if (da && ['asc', 'desc'].includes(da)) {
    console.log('Adding DA to orderBy: ', da);
    orderBy.push({ da: da as 'asc' | 'desc' });
  }

  if (dr && ['asc', 'desc'].includes(dr)) {
    console.log('Adding DR to orderBy: ', dr);
    orderBy.push({ dr: dr as 'asc' | 'desc' });
  }

  if (title && ['asc', 'desc'].includes(title)) {
    orderBy.push({ title: title as 'asc' | 'desc' });
  }

  if (orderBy.length === 0) {
    orderBy.push(
      { createdAt: 'desc' },
      { title: 'asc' }
    );
  }

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

const exportPublicationsToExcel = async () => {
  const publications = await prisma.publication.findMany({
    include: {
      countries: true,
      states: true,
      cities: true,
      niches: true
    }
  });

  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet('Publications');

  worksheet.columns = [
    { header: 'Publication ID', key: 'publicationId', width: 20 },
    { header: 'Title', key: 'title', width: 30 },
    { header: 'Price', key: 'price', width: 12 },
    { header: 'Scope', key: 'scope', width: 15 },
    { header: 'DA', key: 'da', width: 8 },
    { header: 'DR', key: 'dr', width: 8 },
    { header: 'TAT', key: 'tat', width: 10 },
    { header: 'TTP', key: 'ttp', width: 10 },
    { header: 'Location', key: 'location', width: 15 },
    { header: 'Index', key: 'index', width: 15 },
    { header: 'Sponsor', key: 'sponsor', width: 15 },
    { header: 'DoFollow', key: 'doFollow', width: 12 },
    { header: 'Genre', key: 'genre', width: 15 },
    { header: 'Niches', key: 'niches', width: 25 },
    { header: 'Countries', key: 'countries', width: 25 },
    { header: 'States', key: 'states', width: 20 },
    { header: 'Cities', key: 'cities', width: 20 },
    { header: 'Logo URL', key: 'logo', width: 40 },
    { header: 'Created At', key: 'createdAt', width: 20 },
  ];

  worksheet.getRow(1).font = { bold: true };

  publications.forEach((pub) => {
    worksheet.addRow({
      publicationId: pub.publicationId,
      title: pub.title,
      price: pub.price,
      scope: pub.scope || 'N/A',
      da: pub.da || 'N/A',
      dr: pub.dr || 'N/A',
      tat: pub.tat || 'N/A',
      ttp: pub.ttp || 'N/A',
      location: pub.location || 'N/A',
      index: pub.index || 'N/A',
      sponsor: pub.sponsor || 'N/A',
      doFollow: pub.doFollow || 'N/A',
      genre: pub.genre || 'N/A',
      logo: pub.logo || '',
      niches: pub.niches?.map((n: any) => n.name).join(', ') || '',
      countries: pub.countries?.map((c: any) => c.name).join(', ') || '',
      states: pub.states?.map((s: any) => s.name).join(', ') || '',
      cities: pub.cities?.map((city: any) => city.name).join(', ') || '',
      createdAt: pub.createdAt.toISOString(),
    });
  });

  const publicationsExcel = await workbook.xlsx.writeBuffer();
  return workbook;
};

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
  exportPublicationsToExcel,
  getSearchPublications,
  getPublicationById,
  updatePublication,
  deletePublication,
  getPublicationStatistics
};
