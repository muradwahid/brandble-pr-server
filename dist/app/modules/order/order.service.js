"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = exports.getAdminOrders = void 0;
const date_fns_1 = require("date-fns");
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const notification_service_1 = require("../notification/notification.service");
const publication_constant_1 = require("../publication/publication.constant");
const order_constant_1 = require("./order.constant");
const order_functions_1 = require("./order.functions");
const logger_1 = require("../../../shared/logger");
const stripe_1 = __importDefault(require("stripe"));
const config_1 = __importDefault(require("../../../config"));
const SocketHelper_1 = require("../../../helpers/SocketHelper");
const stripe = new stripe_1.default(config_1.default.stripe.secretKey);
const userAllOrders = async (filters, options, userId) => {
    const { page, limit, skip } = paginationHelper_1.paginationHelpers.calculatePagination(options);
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
        });
    }
    const filterKeys = Object.keys(filterData);
    if (filterKeys.length > 0) {
        andConditions.push({
            AND: filterKeys.map(key => {
                if (key === 'status') {
                    return {
                        status: {
                            equals: filterData[key]
                        }
                    };
                }
                if (key === 'publication') {
                    return {
                        publication: {
                            id: filterData[key]
                        }
                    };
                }
                if (key === 'wonArticle') {
                    return {
                        wonArticle: {
                            id: filterData[key]
                        }
                    };
                }
                if (key === 'writeArticle') {
                    return {
                        writeArticle: {
                            id: filterData[key]
                        }
                    };
                }
                return {
                    [key]: {
                        equals: filterData[key]
                    }
                };
            })
        });
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions, userId } : { userId };
    const result = await prisma_1.default.order.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? {
                [options.sortBy]: options.sortOrder,
            }
            : {
                createdAt: 'desc',
            },
        include: {
            user: true,
            wonArticle: true,
            writeArticle: true,
            paymentMethod: true,
            publication: true
        },
    });
    const total = await prisma_1.default.order.count({ where: whereConditions });
    const totalOrders = await prisma_1.default.order.count({ where: { userId } });
    return {
        meta: {
            page,
            limit,
            total,
            totalOrders,
            totalPage: Math.ceil(total / limit),
        },
        data: result,
    };
};
const userPublishedOrders = async (filters, options, userId) => {
    // const { searchTerm, ...filterData } = filters;
    const { page, limit, skip } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    const whereConditions = {
        userId,
        status: 'published',
    };
    const result = await prisma_1.default.order.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? {
                [options.sortBy]: options.sortOrder,
            }
            : {
                createdAt: 'desc',
            },
        include: {
            user: true,
            wonArticle: true,
            writeArticle: true,
            publication: true
        }
    });
    const total = await prisma_1.default.order.count({ where: whereConditions });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
};
const getAdminAllOrders = async (filters, options) => {
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(options);
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
        });
    }
    const filterKeys = Object.keys(filterData);
    if (filterKeys.length > 0) {
        andConditions.push({
            AND: filterKeys.map(key => {
                if (key === 'status') {
                    return {
                        status: {
                            equals: filterData[key]
                        }
                    };
                }
                if (key === 'publication') {
                    return {
                        publication: {
                            id: filterData[key]
                        }
                    };
                }
                if (key === 'wonArticle') {
                    return {
                        wonArticle: {
                            id: filterData[key]
                        }
                    };
                }
                if (key === 'writeArticle') {
                    return {
                        writeArticle: {
                            id: filterData[key]
                        }
                    };
                }
                return {
                    [key]: {
                        equals: filterData[key]
                    }
                };
            })
        });
    }
    let orderSortBy = { createdAt: 'desc' };
    if (sortBy && sortOrder) {
        if (order_constant_1.directSortableFields.includes(sortBy)) {
            orderSortBy = [
                { [sortBy]: sortOrder },
                { createdAt: 'desc' },
            ];
        }
        else if (order_constant_1.nestedSortableFields.includes(sortBy)) {
            orderSortBy = [
                { publication: { [sortBy]: sortOrder } },
                { publication: { id: 'asc' } },
                { createdAt: 'desc' },
            ];
        }
        else {
            orderSortBy = { createdAt: 'desc' };
        }
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = await prisma_1.default.order.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: orderSortBy,
        include: {
            user: true,
            wonArticle: true,
            writeArticle: true,
            paymentMethod: true,
            publication: true
        },
    });
    const total = await prisma_1.default.order.count();
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
};
const getAdminOrders = async (filters, options) => {
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    const andConditions = [];
    // status
    if (filters?.status) {
        andConditions.push({ status: { equals: filters.status } });
    }
    // orderType
    if (filters?.orderType) {
        andConditions.push({ orderType: { equals: filters.orderType } });
    }
    // title -> publication.title
    if (filters?.title) {
        const t = String(filters.title).trim();
        if (t.length) {
            andConditions.push({
                publication: { title: { contains: t, mode: "insensitive" } },
            });
        }
    }
    //createdAt default = today, but if filters.date exists then use that day
    {
        const baseDate = filters.date ? new Date(filters.date) : new Date();
        // start of day (server local time)
        const start = new Date(baseDate);
        start.setHours(0, 0, 0, 0);
        // end of day (server local time)
        const end = new Date(baseDate);
        end.setHours(23, 59, 59, 999);
        andConditions.push({
            createdAt: { gte: start, lte: end },
        });
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    let orderBy = [{ createdAt: "desc" }];
    if (sortBy && sortOrder) {
        if (sortBy === "title") {
            orderBy = [
                { publication: { title: sortOrder } },
                { createdAt: "desc" },
            ];
        }
        else {
            orderBy = [
                { [sortBy]: sortOrder },
                { createdAt: "desc" },
            ];
        }
    }
    const [data, total] = await Promise.all([
        prisma_1.default.order.findMany({
            where: whereConditions,
            skip,
            take: limit,
            orderBy,
            include: {
                user: true,
                wonArticle: true,
                writeArticle: true,
                paymentMethod: true,
                publication: true,
            },
        }),
        prisma_1.default.order.count({ where: whereConditions }),
    ]);
    return {
        meta: { page, limit, total },
        data,
    };
};
exports.getAdminOrders = getAdminOrders;
const userOrders = async (filters, options, userId) => {
    const { page, limit, skip } = paginationHelper_1.paginationHelpers.calculatePagination(options);
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
        });
    }
    const filterKeys = Object.keys(filterData);
    if (filterKeys.length > 0) {
        andConditions.push({
            AND: filterKeys.map(key => {
                if (key === 'status') {
                    return {
                        status: {
                            equals: filterData[key]
                        }
                    };
                }
                if (key === 'publication') {
                    return {
                        publication: {
                            id: filterData[key]
                        }
                    };
                }
                if (key === 'wonArticle') {
                    return {
                        wonArticle: {
                            id: filterData[key]
                        }
                    };
                }
                if (key === 'writeArticle') {
                    return {
                        writeArticle: {
                            id: filterData[key]
                        }
                    };
                }
                return {
                    [key]: {
                        equals: filterData[key]
                    }
                };
            })
        });
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions, userId } : { userId };
    const result = await prisma_1.default.order.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? {
                [options.sortBy]: options.sortOrder,
            }
            : {
                createdAt: 'desc',
            },
        include: {
            user: true,
            wonArticle: true,
            writeArticle: true,
            paymentMethod: true,
            publication: true
        },
    });
    const total = await prisma_1.default.order.count({ where: whereConditions });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
};
const createOrder = async (order) => {
    const { userId, publicationIds, paymentMethodId, currency = 'usd' } = order;
    const pubIds = publicationIds.split(',').map((id) => id.trim());
    const currentUser = await prisma_1.default.user.findUnique({ where: { id: userId } });
    if (!currentUser?.stripeCustomerId)
        throw new ApiError_1.default(400, 'Stripe customer not found');
    const publications = await prisma_1.default.publication.findMany({
        where: { id: { in: pubIds } },
        select: { id: true, price: true, title: true },
    });
    const paymentMethod = await prisma_1.default.paymentMethod.findFirst({
        where: {
            stripePaymentMethodId: paymentMethodId
        }
    });
    if (!paymentMethod)
        throw new ApiError_1.default(400, 'Payment method not found');
    const results = [];
    for (const publication of publications) {
        const pubId = publication.id;
        try {
            if (!publication) {
                results.push({ pubId, status: 'failed', error: 'Publication not found!' });
                continue;
            }
            const amount = Math.round((publication.price || 0) * 100);
            const paymentIntent = await stripe.paymentIntents.create({
                amount,
                currency,
                customer: currentUser.stripeCustomerId,
                payment_method: paymentMethodId,
                off_session: true,
                confirm: true,
            });
            if (paymentIntent.status === 'succeeded') {
                const newOrder = await prisma_1.default.order.create({
                    data: {
                        userId,
                        publicationId: pubId,
                        amount: publication.price || 0,
                        paymentStatus: 'paid',
                        status: 'pending',
                        paymentMethodId: paymentMethod.id
                    },
                });
                results.push({ publication, orderId: newOrder.orderId, status: 'success' });
            }
            else {
                results.push({ publication, status: 'failed', error: 'Payment failed!' });
            }
        }
        catch (error) {
            results.push({ pubId, status: 'failed', error: error.message });
        }
    }
    return {
        message: "Order processing completed",
        summary: results
    };
};
const runningOrders = async (filters, options, id) => {
    const { page, limit, skip } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    const { searchTerm } = filters;
    const andConditions = new Array();
    const isUUID = typeof searchTerm === 'string' && searchTerm?.length === 36;
    if (searchTerm) {
        andConditions.push({
            OR: [
                ...(isUUID ? [{ id: { equals: searchTerm } }] : []),
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
                    detailsSubmitted: {
                        contains: searchTerm,
                        mode: 'insensitive'
                    }
                },
                // Search in related Publication fields
                {
                    publication: {
                        OR: [
                            {
                                title: {
                                    contains: searchTerm,
                                    mode: 'insensitive'
                                }
                            }
                        ]
                    }
                }
            ]
        });
    }
    const fixedConditions = {
        userId: id,
        status: {
            in: ['processing', 'pending']
        }
    };
    const whereConditions = { AND: [...andConditions, fixedConditions] };
    const result = await prisma_1.default.order.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            user: true,
            publication: true,
            wonArticle: true,
            writeArticle: true,
        }
    });
    const total = await prisma_1.default.order.count({ where: whereConditions });
    const totalOrders = await prisma_1.default.order.count({ where: { AND: [fixedConditions] } });
    return {
        meta: {
            page,
            limit,
            total,
            totalOrders,
            totalPage: Math.ceil(total / limit),
        },
        data: result,
    };
};
const getOrderById = async (id) => {
    const result = await prisma_1.default.order.findUnique({
        where: {
            id,
        },
        include: {
            user: true,
            wonArticle: true,
            writeArticle: true,
            paymentMethod: true,
            publication: true
        },
    });
    return result;
};
const getSpecificUserOrders = async (userId, filters, options) => {
    const { searchTerm, ...filterData } = filters;
    const { page, limit, skip } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    const andConditions = [];
    andConditions.push({ userId });
    if (searchTerm) {
        andConditions.push({
            OR: [
                ...order_constant_1.singleUserOrderSearchableFields.map((field) => ({
                    [field]: { contains: searchTerm, mode: 'insensitive' },
                })),
                {
                    publication: {
                        OR: publication_constant_1.publicationSearchableFields.map((field) => ({
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
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const [orders, total] = await Promise.all([
        prisma_1.default.order.findMany({
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
        prisma_1.default.order.count({ where: whereConditions }),
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
const updateOrder = async (id, data) => {
    const result = await prisma_1.default.order.update({
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
    return result;
};
const deleteOrder = async (id) => {
    const result = await prisma_1.default.order.delete({
        where: {
            id,
        },
    });
    return result;
};
const getOrderStatistics = async (filters) => {
    const now = new Date();
    // Determine date ranges based on filters
    let currentPeriodRange;
    let previousPeriodRange;
    let periodLabel;
    let previousPeriodLabel;
    if (filters.today) {
        // Today vs Yesterday
        const todayStart = (0, date_fns_1.startOfDay)(now);
        const yesterdayStart = (0, date_fns_1.startOfDay)((0, date_fns_1.subDays)(now, 1));
        currentPeriodRange = { gte: todayStart };
        previousPeriodRange = { gte: yesterdayStart, lt: todayStart };
        periodLabel = 'Today';
        previousPeriodLabel = 'Yesterday';
    }
    else if (filters.thisWeek) {
        // This Week vs Last Week
        const thisWeekStart = (0, date_fns_1.startOfWeek)(now, { weekStartsOn: 1 });
        const lastWeekStart = (0, date_fns_1.startOfWeek)((0, date_fns_1.subWeeks)(now, 1), { weekStartsOn: 1 });
        currentPeriodRange = { gte: thisWeekStart };
        previousPeriodRange = { gte: lastWeekStart, lt: thisWeekStart };
        periodLabel = 'This Week';
        previousPeriodLabel = 'Last Week';
    }
    else {
        // This Month vs Last Month (default)
        const thisMonth = (0, date_fns_1.startOfMonth)(now);
        const lastMonth = (0, date_fns_1.startOfMonth)((0, date_fns_1.subMonths)(now, 1));
        currentPeriodRange = { gte: thisMonth };
        previousPeriodRange = { gte: lastMonth, lt: thisMonth };
        periodLabel = 'This Month';
        previousPeriodLabel = 'Last Month';
    }
    // Run queries for both periods in parallel
    const [currentPeriodData, previousPeriodData] = await Promise.all([
        // Current period data
        getOrderStatsForPeriod(currentPeriodRange),
        // Previous period data
        getOrderStatsForPeriod(previousPeriodRange)
    ]);
    // Calculate growth rates
    const growthRates = {
        totalOrders: calculateGrowthRate(currentPeriodData.totalOrders, previousPeriodData.totalOrders),
        newClients: calculateGrowthRate(currentPeriodData.newClients, previousPeriodData.newClients),
        repeatClients: calculateGrowthRate(currentPeriodData.repeatClients, previousPeriodData.repeatClients),
        delivered: calculateGrowthRate(currentPeriodData.delivered, previousPeriodData.delivered),
        inProgress: calculateGrowthRate(currentPeriodData.inProgress, previousPeriodData.inProgress),
    };
    return {
        summary: {
            period: periodLabel,
            previousPeriod: previousPeriodLabel,
            filter: filters.today ? 'today' : filters.thisWeek ? 'thisWeek' : 'thisMonth'
        },
        currentPeriod: currentPeriodData,
        previousPeriod: previousPeriodData,
        growthRates,
    };
};
// Helper function to get order statistics for a specific period
const getOrderStatsForPeriod = async (dateRange) => {
    // 1. Get how many orders each user has made in this period
    const userOrderCounts = await prisma_1.default.order.groupBy({
        by: ['userId'],
        where: {
            createdAt: dateRange
        },
        _count: {
            _all: true,
        },
    });
    // 2. Classify users for this period
    let newClients = 0;
    let repeatClients = 0;
    for (const user of userOrderCounts) {
        if (user._count._all === 1) {
            newClients++;
        }
        else if (user._count._all > 1) {
            repeatClients++;
        }
    }
    // 3. Get status counts for this period
    const statusCounts = await prisma_1.default.order.groupBy({
        by: ['status'],
        where: {
            createdAt: dateRange
        },
        _count: {
            _all: true,
        },
    });
    const totalOrders = userOrderCounts.reduce((sum, u) => sum + u._count._all, 0);
    const delivered = statusCounts.find(s => s.status === 'published')?._count._all || 0;
    const inProgress = (statusCounts.find(s => s.status === 'pending')?._count._all || 0) +
        (statusCounts.find(s => s.status === 'processing')?._count._all || 0);
    return {
        totalOrders,
        newClients,
        repeatClients,
        delivered,
        inProgress,
    };
};
// Helper function to calculate growth rate
const calculateGrowthRate = (current, previous) => {
    if (previous === 0) {
        return current > 0 ? '+100%' : '0%';
    }
    const rate = ((current - previous) / previous) * 100;
    const formatted = Math.abs(rate) < 0.1 ? '0%' : rate.toFixed(1) + '%';
    return rate > 0 ? `+${formatted}` : formatted;
};
const getRevenueStatistics = async () => {
    const today = new Date();
    const sevenDaysAgo = (0, date_fns_1.subDays)(today, 6);
    const orders = await prisma_1.default.order.findMany({
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
    const chartData = order_constant_1.dayNames.map((day, index) => ({
        name: day,
        uv: Math.round(weeklyRevenue[index]),
        amt: weeklyRevenue[index] + 500,
    }));
    return {
        todayRevenue,
        weekRevenue: last7DaysRevenue,
        week: chartData,
    };
};
const getPaymentRevenueStatistics = async () => {
    const now = new Date();
    const allRevenue = await prisma_1.default.order.groupBy({
        by: ['createdAt'],
        where: {
            createdAt: { gte: (0, date_fns_1.startOfYear)(now) },
        },
        _sum: { amount: true },
        orderBy: { createdAt: 'asc' },
    });
    const revenueByDay = new Map();
    const revenueByMonth = new Map();
    const revenueByHour = new Map();
    allRevenue.forEach(item => {
        const date = new Date(item.createdAt);
        const dayKey = (0, date_fns_1.format)(date, 'yyyy-MM-dd');
        const monthKey = (0, date_fns_1.format)(date, 'yyyy-MM');
        const hourKey = (0, date_fns_1.format)(date, 'yyyy-MM-dd HH');
        const amount = item._sum.amount || 0;
        revenueByDay.set(dayKey, (revenueByDay.get(dayKey) || 0) + amount);
        revenueByMonth.set(monthKey, (revenueByMonth.get(monthKey) || 0) + amount);
        revenueByHour.set(hourKey, (revenueByHour.get(hourKey) || 0) + amount);
    });
    const getRev = (date, type) => {
        if (type === 'day')
            return revenueByDay.get((0, date_fns_1.format)(date, 'yyyy-MM-dd')) || 0;
        if (type === 'month')
            return revenueByMonth.get((0, date_fns_1.format)(date, 'yyyy-MM')) || 0;
        if (type === 'hour')
            return revenueByHour.get((0, date_fns_1.format)(date, 'yyyy-MM-dd HH')) || 0;
        return 0;
    };
    const totalToday = (0, order_functions_1.eachHourOfInterval)((0, date_fns_1.startOfDay)(now), (0, date_fns_1.endOfDay)(now))
        .reduce((sum, hour) => sum + getRev(hour, 'hour'), 0);
    const totalLast7Days = (0, order_functions_1.eachDayOfInterval)((0, date_fns_1.subDays)(now, 6), now)
        .reduce((sum, day) => sum + getRev(day, 'day'), 0);
    const totalThisMonth = (0, order_functions_1.eachDayOfInterval)((0, date_fns_1.startOfMonth)(now), (0, date_fns_1.endOfMonth)(now))
        .reduce((sum, day) => sum + getRev(day, 'day'), 0);
    const totalLastMonth = (() => {
        const last = (0, date_fns_1.subMonths)(now, 1);
        return (0, order_functions_1.eachDayOfInterval)((0, date_fns_1.startOfMonth)(last), (0, date_fns_1.endOfMonth)(last))
            .reduce((sum, day) => sum + getRev(day, 'day'), 0);
    })();
    const totalThisYear = (0, order_functions_1.eachMonthOfInterval)((0, date_fns_1.startOfYear)(now), (0, date_fns_1.endOfYear)(now))
        .reduce((sum, month) => sum + getRev(month, 'month'), 0);
    return {
        today: (0, order_functions_1.eachHourOfInterval)((0, date_fns_1.startOfDay)(now), (0, date_fns_1.endOfDay)(now)).map(hour => ({
            name: (0, date_fns_1.format)(hour, 'ha'),
            uv: getRev(hour, 'hour'),
            pv: getRev(hour, 'hour'),
            amt: getRev(hour, 'hour'),
        })),
        last7Days: (0, order_functions_1.eachDayOfInterval)((0, date_fns_1.subDays)(now, 6), now).map(day => ({
            name: (0, date_fns_1.format)(day, 'EEE'),
            uv: getRev(day, 'day'),
            pv: getRev(day, 'day'),
            amt: getRev(day, 'day'),
        })),
        thisMonth: (0, order_functions_1.eachDayOfInterval)((0, date_fns_1.startOfMonth)(now), (0, date_fns_1.endOfMonth)(now)).map(day => ({
            name: (0, date_fns_1.format)(day, 'dd EEE'),
            uv: getRev(day, 'day'),
            pv: getRev(day, 'day'),
            amt: getRev(day, 'day'),
        })),
        lastMonth: (() => {
            const last = (0, date_fns_1.subMonths)(now, 1);
            return (0, order_functions_1.eachDayOfInterval)((0, date_fns_1.startOfMonth)(last), (0, date_fns_1.endOfMonth)(last)).map(day => ({
                name: (0, date_fns_1.format)(day, 'dd EEE'),
                uv: getRev(day, 'day'),
                pv: getRev(day, 'day'),
                amt: getRev(day, 'day'),
            }));
        })(),
        thisYear: (0, order_functions_1.eachMonthOfInterval)((0, date_fns_1.startOfYear)(now), (0, date_fns_1.endOfYear)(now)).map(month => ({
            name: (0, date_fns_1.format)(month, 'MMM'),
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
    const result = await prisma_1.default.order.findMany({
        where: {
            status: {
                notIn: ['completed', 'unable-to-published'],
            },
        },
        include: {
            publication: true,
            wonArticle: true,
            writeArticle: true
        }
    });
    const total = await prisma_1.default.order.count();
    // Format for frontend
    return {
        total,
        orders: result
    };
};
const updateOrderStatus = async (orderId, status, adminUserId) => {
    return await prisma_1.default.$transaction(async (tx) => {
        const currentOrder = await tx.order.findUnique({
            where: { id: orderId },
            include: { user: true, publication: true },
        });
        if (!currentOrder) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Order not found');
        }
        const updatedOrder = await tx.order.update({
            where: { id: orderId },
            data: { status },
            include: {
                user: true,
                publication: true,
            },
        });
        if (updatedOrder && updatedOrder.userId) {
            SocketHelper_1.SocketHelper.sendToUserAndAdmins(updatedOrder.userId, "order_updated", status);
        }
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
                await notification_service_1.NotificationService.createNotification(updatedOrder.user.id, notificationTitle, notificationMessage, 'order_status', orderId, adminUserId);
            }
            catch (error) {
                logger_1.logger.error('Notification failed (but order updated):', error);
            }
        }
        return updatedOrder;
    });
};
exports.OrderService = {
    userAllOrders,
    userPublishedOrders,
    getAdminAllOrders,
    getAdminOrders: exports.getAdminOrders,
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
