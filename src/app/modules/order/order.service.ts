
import { subDays, format, startOfDay, endOfDay, startOfMonth, endOfMonth, subMonths, startOfYear, endOfYear } from 'date-fns';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { NotificationService } from '../notification/notification.service';
import { publicationSearchableFields } from '../publication/publication.constant';
import { dayNames, singleUserOrderSearchableFields } from './order.constant';
import { IOrder, IOrderSearchableFields } from './order.interface';
import { eachDayOfInterval, eachHourOfInterval, eachMonthOfInterval } from './order.functions';

const userAllOrders = async (
  filters: IOrderSearchableFields,
  options: IPaginationOptions,
  userId: string
) => {

  const { page, limit, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = new Array();

  if (searchTerm) {
    andConditions.push({
      OR: [
        // Search in direct Order fields
        {
          orderId: {
            contains: searchTerm,
            mode: 'insensitive'
          }
        },
        {
          orderType: {
            contains: searchTerm,
            mode: 'insensitive'
          }
        },
        {
          status: {
            contains: searchTerm,
            mode: 'insensitive'
          }
        },
        {
          detailsSubmitted: {
            contains: searchTerm,
            mode: 'insensitive'
          }
        },
        // Search in related Publication fields
        {
          publication: {
            some: {
              OR: [
                {
                  title: {
                    contains: searchTerm,
                    mode: 'insensitive'
                  }
                },
                {
                  region: {
                    contains: searchTerm,
                    mode: 'insensitive'
                  }
                },
                {
                  location: {
                    contains: searchTerm,
                    mode: 'insensitive'
                  }
                },
                {
                  da: {
                    contains: searchTerm,
                    mode: 'insensitive'
                  }
                },
                {
                  dr: {
                    contains: searchTerm,
                    mode: 'insensitive'
                  }
                }
              ]
            }
          }
        },
        // Search in User fields
        {
          user: {
            OR: [
              {
                name: {
                  contains: searchTerm,
                  mode: 'insensitive'
                }
              },
              {
                email: {
                  contains: searchTerm,
                  mode: 'insensitive'
                }
              }
            ]
          }
        }
      ]
    })
  }


  const filterKeys = Object.keys(filterData);

  if (filterKeys.length > 0) {
    andConditions.push({
      AND: filterKeys.map(key => {
        if (key === 'status') {
          return {
            status: {
              equals: (filterData as any)[key]
            }
          }
        }
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
  const whereConditions = andConditions.length > 0 ? { AND: andConditions, userId } : { userId};

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
      wonArticle: true,
      writeArticle: true,
      paymentMethod:true,
      publication:true
    },
  });

  const total = await prisma.order.count();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};
const getAdminAllOrders = async (
  filters: IOrderSearchableFields,
  options: IPaginationOptions
) => {

  const { page, limit, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = new Array();

  if (searchTerm) {
    andConditions.push({
      OR: [
        // Search in direct Order fields
        {
          orderId: {
            contains: searchTerm,
            mode: 'insensitive'
          }
        },
        {
          orderType: {
            contains: searchTerm,
            mode: 'insensitive'
          }
        },
        {
          status: {
            contains: searchTerm,
            mode: 'insensitive'
          }
        },
        {
          detailsSubmitted: {
            contains: searchTerm,
            mode: 'insensitive'
          }
        },
        // Search in related Publication fields
        {
          publication: {
            some: {
              OR: [
                {
                  title: {
                    contains: searchTerm,
                    mode: 'insensitive'
                  }
                },
                {
                  region: {
                    contains: searchTerm,
                    mode: 'insensitive'
                  }
                },
                {
                  location: {
                    contains: searchTerm,
                    mode: 'insensitive'
                  }
                },
                {
                  da: {
                    contains: searchTerm,
                    mode: 'insensitive'
                  }
                },
                {
                  dr: {
                    contains: searchTerm,
                    mode: 'insensitive'
                  }
                }
              ]
            }
          }
        },
        // Search in User fields
        {
          user: {
            OR: [
              {
                name: {
                  contains: searchTerm,
                  mode: 'insensitive'
                }
              },
              {
                email: {
                  contains: searchTerm,
                  mode: 'insensitive'
                }
              }
            ]
          }
        }
      ]
    })
  }


  const filterKeys = Object.keys(filterData);

  if (filterKeys.length > 0) {
    andConditions.push({
      AND: filterKeys.map(key => {
        if (key === 'status') {
          return {
            status: {
              equals: (filterData as any)[key]
            }
          }
        }
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
      wonArticle: true,
      writeArticle: true,
      paymentMethod:true,
      publication:true
    },
  });

  const total = await prisma.order.count();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};
const userOrders = async (
  filters: IOrderSearchableFields,
  options: IPaginationOptions,
  userId: string
) => {

  const { page, limit, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = new Array();

  if (searchTerm) {
    andConditions.push({
      OR: [
        // Search in direct Order fields
        {
          id: {
            contains: searchTerm,
            mode: 'insensitive'
          }
        },
        {
          orderId: {
            contains: searchTerm,
            mode: 'insensitive'
          }
        },
        {
          orderType: {
            contains: searchTerm,
            mode: 'insensitive'
          }
        },
        {
          status: {
            contains: searchTerm,
            mode: 'insensitive'
          }
        },
        {
          detailsSubmitted: {
            contains: searchTerm,
            mode: 'insensitive'
          }
        },
        // Search in related Publication fields
        {
          publication: {
            some: {
              OR: [
                {
                  title: {
                    contains: searchTerm,
                    mode: 'insensitive'
                  }
                },
                {
                  region: {
                    contains: searchTerm,
                    mode: 'insensitive'
                  }
                },
                {
                  location: {
                    contains: searchTerm,
                    mode: 'insensitive'
                  }
                },
                {
                  da: {
                    contains: searchTerm,
                    mode: 'insensitive'
                  }
                },
                {
                  dr: {
                    contains: searchTerm,
                    mode: 'insensitive'
                  }
                }
              ]
            }
          }
        },
        // Search in User fields
        {
          user: {
            OR: [
              {
                name: {
                  contains: searchTerm,
                  mode: 'insensitive'
                }
              },
              {
                email: {
                  contains: searchTerm,
                  mode: 'insensitive'
                }
              }
            ]
          }
        }
      ]
    })
  }


  const filterKeys = Object.keys(filterData);

  if (filterKeys.length > 0) {
    andConditions.push({
      AND: filterKeys.map(key => {
        if (key === 'status') {
          return {
            status: {
              equals: (filterData as any)[key]
            }
          }
        }
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
  const whereConditions = andConditions.length > 0 ? { AND: andConditions, userId } : {userId};

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
      wonArticle: true,
      writeArticle: true,
      paymentMethod:true,
      publication:true
    },
  });

  const total = await prisma.order.count();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};



const createOrder = async (order: any) => {
  const {
    userId,
    publicationId,
    wonArticleId,
    writeArticleId,
    paymentMethodId,
    methodId,
    amount,
  } = order;
  const data: any = {
    methodId,
    amount,
    ...(userId && {
      user: { connect: { id: userId } },
    }),
    ...(publicationId && {
      publication: { connect: { id: publicationId } },
    }),
    ...(wonArticleId && {
      wonArticle: { connect: { id: wonArticleId } },
    }),
    ...(writeArticleId && {
      writeArticle: { connect: { id: writeArticleId } },
    }),
    ...(paymentMethodId && {
      paymentMethod: { connect: { id: paymentMethodId } },
    }),
  };

  const result = await prisma.order.create({
    data,
    include: {
      user: true,
      publication: true,
      wonArticle: true,
      writeArticle: true,
      paymentMethod: true,
    },
  });

  return result;
};

const runningOrders = async (id: string) => {
  
  const result = await prisma.order.findMany({
    where: {
      userId: id,
      status: {
        in: ['processing', 'pending']
      }
    },
    include: {
      user: true,
      publication: true,
      wonArticle: true,
      writeArticle: true,
    }
  })


  return result
}

const getOrderById = async (id: string) => {
  const result = await prisma.order.findUnique({
    where: {
      id,
    },
    include: {
      user: true,
      wonArticle: true,
      writeArticle: true,
      paymentMethod: true,
      publication:true
    },
  });

  return result;
};

const getSpecificUserOrders = async (
  userId: string,
  filters: IOrderSearchableFields,
  options: IPaginationOptions
) => {
  const { searchTerm, ...filterData } = filters;
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);

  const andConditions = [];

  andConditions.push({ userId });

  if (searchTerm) {
    andConditions.push({
      OR: [
        ...singleUserOrderSearchableFields.map((field) => ({
          [field]: { contains: searchTerm, mode: 'insensitive' },
        })),
        {
          publication: {
            OR: publicationSearchableFields.map((field) => ({
              [field]: { contains: searchTerm, mode: 'insensitive' },
            })),
          },
        },
      ],
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.entries(filterData).map(([key, value]) => ({
        [key]: { equals: value },
      })),
    });
  }

  const whereConditions =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where: whereConditions,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        publication: {
          select: {
            id: true,
            title: true,
            logo: true,
            price: true,
            genre: true,
            location: true,
            sponsor: true,
            doFollow: true,
            da: true,
            dr: true,
            index: true,
          },
        },
      },
    }),
    prisma.order.count({ where: whereConditions }),
  ]);

  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
    data: orders,
  };
};

const updateOrder = async (id: string, data: Partial<IOrder | any>): Promise<Partial<IOrder> | null> => {
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

const deleteOrder = async (id: string): Promise<Partial<IOrder> | null> => {
  const result = await prisma.order.delete({
    where: {
      id,
    },
  });
  return result as unknown as Partial<IOrder>;
};
const getOrderStatistics = async () => {
  // 1. Get how many orders each user has made
  const userOrderCounts = await prisma.order.groupBy({
    by: ['userId'],
    _count: {
      _all: true,
    },
  });

  // 2. Classify users
  let newClients = 0;
  let repeatClients = 0;

  for (const user of userOrderCounts) {
    if (user._count._all === 1) {
      newClients++;
    } else if (user._count._all > 1) {
      repeatClients++;
    }
  }

  // 3. Get status counts
  const statusCounts = await prisma.order.groupBy({
    by: ['status'],
    _count: {
      _all: true,
    },
  });

  const totalOrders = userOrderCounts.reduce((sum, u) => sum + u._count._all, 0);

  const delivered = statusCounts.find(s => s.status === 'published')?._count._all || 0;
  const inProgress =
    (statusCounts.find(s => s.status === 'pending')?._count._all || 0) +
    (statusCounts.find(s => s.status === 'processing')?._count._all || 0);

  return {
    totalOrders,
    newClients,
    repeatClients,
    delivered,
    inProgress,
  };
};



const getRevenueStatistics = async () => {
  const today = new Date();
  const sevenDaysAgo = subDays(today, 6); 

  const orders = await prisma.order.findMany({
    where: {
      createdAt: {
        gte: sevenDaysAgo,
        lte: today,
      },
    },
    select: {
      amount: true,
      createdAt: true,
    },
  });

  let todayRevenue = 0;
  let last7DaysRevenue = 0;

  const weeklyRevenue = Array(7).fill(0);

  orders.forEach((order) => {
    const orderDate = order.createdAt;
    const daysAgo = Math.floor((today.getTime() - orderDate.getTime()) / 86400000);

    if (daysAgo >= 0 && daysAgo < 7) {
      last7DaysRevenue += order.amount;

      if (daysAgo === 0) {
        todayRevenue += order.amount;
      }

      const jsDay = orderDate.getDay();
      const ourIndex = jsDay === 0 ? 1 : jsDay === 6 ? 0 : jsDay;
      weeklyRevenue[ourIndex] += order.amount;
    }
  });

  const chartData = dayNames.map((day, index) => ({
    name: day,
    uv: Math.round(weeklyRevenue[index]),
    amt: weeklyRevenue[index] + 500,
  }));

  return {
    todayRevenue,
    weekRevenue:last7DaysRevenue,  
    week:chartData,       
  };
};

const getPaymentRevenueStatistics = async () => {
  const now = new Date();

  const allRevenue = await prisma.order.groupBy({
    by: ['createdAt'],
    where: {
      createdAt: { gte: startOfYear(now) },
    },
    _sum: { amount: true },
    orderBy: { createdAt: 'asc' },
  });

  const revenueByDay = new Map<string, number>();
  const revenueByMonth = new Map<string, number>();
  const revenueByHour = new Map<string, number>();

  allRevenue.forEach(item => {
    const date = new Date(item.createdAt);
    const dayKey = format(date, 'yyyy-MM-dd');
    const monthKey = format(date, 'yyyy-MM');
    const hourKey = format(date, 'yyyy-MM-dd HH');

    const amount = item._sum.amount || 0;

    revenueByDay.set(dayKey, (revenueByDay.get(dayKey) || 0) + amount);
    revenueByMonth.set(monthKey, (revenueByMonth.get(monthKey) || 0) + amount);
    revenueByHour.set(hourKey, (revenueByHour.get(hourKey) || 0) + amount);
  });

  const getRev = (date: Date, type: 'day' | 'month' | 'hour') => {
    if (type === 'day') return revenueByDay.get(format(date, 'yyyy-MM-dd')) || 0;
    if (type === 'month') return revenueByMonth.get(format(date, 'yyyy-MM')) || 0;
    if (type === 'hour') return revenueByHour.get(format(date, 'yyyy-MM-dd HH')) || 0;
    return 0;
  };

  const totalToday = eachHourOfInterval(startOfDay(now), endOfDay(now))
    .reduce((sum, hour) => sum + getRev(hour, 'hour'), 0);

  const totalLast7Days = eachDayOfInterval(subDays(now, 6), now)
    .reduce((sum, day) => sum + getRev(day, 'day'), 0);

  const totalThisMonth = eachDayOfInterval(startOfMonth(now), endOfMonth(now))
    .reduce((sum, day) => sum + getRev(day, 'day'), 0);

  const totalLastMonth = (() => {
    const last = subMonths(now, 1);
    return eachDayOfInterval(startOfMonth(last), endOfMonth(last))
      .reduce((sum, day) => sum + getRev(day, 'day'), 0);
  })();

  const totalThisYear = eachMonthOfInterval(startOfYear(now), endOfYear(now))
    .reduce((sum, month) => sum + getRev(month, 'month'), 0);

  return {
    today: eachHourOfInterval(startOfDay(now), endOfDay(now)).map(hour => ({
      name: format(hour, 'ha'),
      uv: getRev(hour, 'hour'),
      pv: getRev(hour, 'hour'),
      amt: getRev(hour, 'hour'),
    })),

    last7Days: eachDayOfInterval(subDays(now, 6), now).map(day => ({
      name: format(day, 'EEE'),
      uv: getRev(day, 'day'),
      pv: getRev(day, 'day'),
      amt: getRev(day, 'day'),
    })),

    thisMonth: eachDayOfInterval(startOfMonth(now), endOfMonth(now)).map(day => ({
      name: format(day, 'dd EEE'),
      uv: getRev(day, 'day'),
      pv: getRev(day, 'day'),
      amt: getRev(day, 'day'),
    })),

    lastMonth: (() => {
      const last = subMonths(now, 1);
      return eachDayOfInterval(startOfMonth(last), endOfMonth(last)).map(day => ({
        name: format(day, 'dd EEE'),
        uv: getRev(day, 'day'),
        pv: getRev(day, 'day'),
        amt: getRev(day, 'day'),
      }));
    })(),

    thisYear: eachMonthOfInterval(startOfYear(now), endOfYear(now)).map(month => ({
      name: format(month, 'MMM'),
      uv: getRev(month, 'month'),
      pv: getRev(month, 'month'),
      amt: getRev(month, 'month'),
    })),

    revenue: {
      today: totalToday,
      last7Days: totalLast7Days,
      thisMonth: totalThisMonth,
      lastMonth: totalLastMonth,
      thisYear: totalThisYear,
    },
  };
};

const getUpcomingDeadlines = async () => {

  const result = await prisma.order.findMany({
    where: {
      status: {
        notIn: ['completed', 'unable-to-published'],
      },
    },
    include: {
      publication: true,
      wonArticle: true,
      writeArticle:true
    }
  });
  const total = await prisma.order.count();

  // Format for frontend
  return {
    total,
    orders: result
  }
};

const updateOrderStatus = async (orderId: string, status: string, adminUserId?: string) => {

  return await prisma.$transaction(async (tx) => {
    const currentOrder = await tx.order.findUnique({
      where: { id: orderId },
      include: { user: true, publication: true },
    });

    if (!currentOrder) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
    }

    const updatedOrder = await tx.order.update({
      where: { id: orderId },
      data: { status },
      include: {
        user: true,
        publication: true,
      },
    });

    // Notification message
    let notificationTitle = 'Order Status Updated';
    let notificationMessage = `Your order #${updatedOrder.orderId} is now ${status}.`;

    switch (status) {
      case 'published':
        notificationTitle = 'Your Article is Live!';
        notificationMessage = `Congratulations! Your article for order #${updatedOrder.orderId} has been published on ${updatedOrder.publication?.title || 'the site'}.`;
        break;
      case 'processing':
        notificationTitle = 'Order Processing Started';
        notificationMessage = `Great news! Your order #${updatedOrder.orderId} is now being processed.`;
        break;
      case 'completed':
        notificationTitle = 'Order Completed';
        notificationMessage = `Your order #${updatedOrder.orderId} has been completed successfully.`;
        break;
      case 'cancelled':
        notificationTitle = 'Order Cancelled';
        notificationMessage = `Your order #${updatedOrder.orderId} has been cancelled.`;
        break;
    }



    if (updatedOrder.user?.id) {
      try {
        await NotificationService.createNotification(
          updatedOrder.user.id, 
          notificationTitle,
          notificationMessage,
          'order_status',
          orderId,
          adminUserId
        );
      } catch (error) {
        console.error('Notification failed (but order updated):', error);
      }
    } else {
      console.log('No user attached to this order. Notification skipped.');
    }

    return updatedOrder;
  });
};

export const OrderService = {
  userAllOrders,
  getAdminAllOrders,
  createOrder,
  runningOrders,
  getOrderById,
  getSpecificUserOrders,
  updateOrder,
  deleteOrder,
  getOrderStatistics,
  updateOrderStatus,
  userOrders,
  getRevenueStatistics,
  getUpcomingDeadlines,
  getPaymentRevenueStatistics
};
