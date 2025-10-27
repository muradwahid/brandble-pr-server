
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { orderSearchableFields } from './order.constant';
import { IOrder, IOrderSearchableFields } from './order.interface';

const allOrders = async (
  filters: IOrderSearchableFields,
  options: IPaginationOptions,
): Promise<IGenericResponse<Partial<IOrder>[]>> => {

  const { page, limit, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;
  const andConditions = new Array();
  if (searchTerm) { 
    andConditions.push({
      OR: orderSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive'
        }
      }))
    })
  }

  const filterKeys = Object.keys(filterData);

  if (filterKeys.length > 0) { 
    andConditions.push({
      AND: filterKeys.map(key => { 
        if (key === 'publication') { 
          return {
            publication: {
              id: (filterData as any)[key]
            }
          }
        }
        if (key === 'wonArticle') { 
          return {
            wonArticle: {
              id: (filterData as any)[key]
            }
          }
        }
        if (key === 'writeArticle') { 
          return {
            writeArticle: {
              id: (filterData as any)[key]
            }
          }
        }
        return {
          [key]: {
            equals: (filterData as any)[key]
          }
        }
      })
    })
  }
  const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.order.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy as any]: options.sortOrder,
          }
        : {
            createdAt: 'desc',
          },
    include: {
      user: true,
      publication: true,
      wonArticle: true,
      writeArticle: true,
    },
  });
  const total = await prisma.order.count();
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result as unknown as Partial<IOrder>[],
  };
};

const createOrder = async (
  order: Partial<IOrder>,
): Promise<Partial<IOrder >> => {
  // Destructure only the fields needed for creation
  const {
    id,
    createdAt,
    updatedAt,
    user,
    publication,
    wonArticle,
    writeArticle,
    ...orderData
  } = order;

  // Create the data object with proper type handling
  const createData: any = {
    ...orderData,
  };

  // Only add relation fields if they exist
  if (order.userId) {
    createData.userId = order.userId;
  }
  if (order.publicationId) {
    createData.publicationId = order.publicationId;
  }
  if (order.wonArticle?.id) {
    createData.wonArticleId = order.wonArticle.id;
  }
  if (order.writeArticle?.id) {
    createData.writeArticleId = order.writeArticle.id;
  }

  const result = await prisma.order.create({
    data: createData,
    include: {
      user: true,
      publication: true,
      wonArticle: true,
      writeArticle: true,
    },
  });
  return result as unknown as Partial<IOrder>;
};

export const getOrderById = async (id: string): Promise<Partial<IOrder> | null> => {
  const result = await prisma.order.findUnique({
    where: {
      id,
    },
    include: {
      user: true,
      publication: true,
      wonArticle: true,
      writeArticle: true,
    },
  });
  return result as unknown as Partial<IOrder>;
};

export const updateOrder = async (id: string, data: Partial<IOrder | any>): Promise<Partial<IOrder> | null> => {
  const result = await prisma.order.update({
    where: {
      id,
    },
    data,
    include: {
      user: true,
      publication: true,
      wonArticle: true,
      writeArticle: true,
    },
  });
  return result as unknown as Partial<IOrder>;
};

export const deleteOrder = async (id: string): Promise<Partial<IOrder> | null> => {
  const result = await prisma.order.delete({
    where: {
      id,
    },
  });
  return result as unknown as Partial<IOrder>;
};

export const OrderService = {
  allOrders,
  createOrder,
  getOrderById,
  updateOrder,
  deleteOrder,
};
