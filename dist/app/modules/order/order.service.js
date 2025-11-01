"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = exports.deleteOrder = exports.updateOrder = exports.getOrderById = void 0;
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const order_constant_1 = require("./order.constant");
const allOrders = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    const andConditions = new Array();
    if (searchTerm) {
        andConditions.push({
            OR: order_constant_1.orderSearchableFields.map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive'
                }
            }))
        });
    }
    const filterKeys = Object.keys(filterData);
    if (filterKeys.length > 0) {
        andConditions.push({
            AND: filterKeys.map(key => {
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
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma_1.default.order.findMany({
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
            method: true
        },
    });
    const total = yield prisma_1.default.order.count();
    // return {
    //   meta: {
    //     page,
    //     limit,
    //     total,
    //   },
    //   data: result as unknown as Partial<IOrder>[],
    // };
    // collect all publicationIds from orders (handles undefined)
    const allPubIds = Array.from(new Set(result.flatMap(r => r.publicationIds || [])));
    // fetch publications once (support both Publication.id (uuid) and Publication.publicationId (nanoid))
    const publications = allPubIds.length
        ? yield prisma_1.default.publication.findMany({
            where: {
                OR: [
                    { id: { in: allPubIds } },
                    { publicationId: { in: allPubIds } }
                ]
            }
        })
        : [];
    // build lookup maps for fast matching
    const byId = new Map(publications.map(p => [p.id, p]));
    const byPubId = new Map(publications.map(p => [p.publicationId, p]));
    // attach publications to each order
    const mapped = result.map(r => {
        const pubs = (r.publicationIds || []).map(pid => { var _a; return (_a = byId.get(pid)) !== null && _a !== void 0 ? _a : byPubId.get(pid); }).filter(Boolean);
        // remove publicationIds if you prefer and add publications
        return Object.assign(Object.assign({}, r), { publication: pubs });
    });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: mapped,
    };
});
const createOrder = (order) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    // Destructure only the fields needed for creation
    const { id, createdAt, updatedAt, user, publication, wonArticle, writeArticle } = order, orderData = __rest(order, ["id", "createdAt", "updatedAt", "user", "publication", "wonArticle", "writeArticle"]);
    // Create the data object with proper type handling
    const createData = Object.assign({}, orderData);
    // Only add relation fields if they exist
    if (order.userId) {
        createData.userId = order.userId;
    }
    if (order.publicationId) {
        createData.publicationId = order.publicationId;
    }
    if ((_a = order.wonArticle) === null || _a === void 0 ? void 0 : _a.id) {
        createData.wonArticleId = order.wonArticle.id;
    }
    if ((_b = order.writeArticle) === null || _b === void 0 ? void 0 : _b.id) {
        createData.writeArticleId = order.writeArticle.id;
    }
    const result = yield prisma_1.default.order.create({
        data: createData,
        include: {
            user: true,
            publication: true,
            wonArticle: true,
            writeArticle: true,
        },
    });
    return result;
});
const getOrderById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.order.findUnique({
        where: {
            id,
        },
        include: {
            user: true,
            wonArticle: true,
            writeArticle: true,
            method: true
        },
    });
    if (!result)
        return {};
    const publication = result.publicationIds && result.publicationIds.length
        ? yield prisma_1.default.publication.findMany({ where: { id: { in: result.publicationIds } } })
        : [];
    return Object.assign(Object.assign({}, result), { publication });
});
exports.getOrderById = getOrderById;
const updateOrder = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.order.update({
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
});
exports.updateOrder = updateOrder;
const deleteOrder = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.order.delete({
        where: {
            id,
        },
    });
    return result;
});
exports.deleteOrder = deleteOrder;
const getOrderStatistics = () => __awaiter(void 0, void 0, void 0, function* () {
    const [allOrders, clientOrders] = yield Promise.all([
        prisma_1.default.order.findMany({
            select: { id: true, userId: true, status: true },
        }),
        prisma_1.default.order.groupBy({
            by: ['userId'],
            _count: { id: true },
        }),
    ]);
    // Determine which clients are new vs repeat
    const repeatClients = new Set(clientOrders.filter(c => { var _a; return ((_a = c._count) === null || _a === void 0 ? void 0 : _a.id) && c._count.id > 1; }).map(c => c.userId));
    let newClient = 0;
    let repeatClient = 0;
    let delivered = 0;
    let inProgress = 0;
    for (const order of allOrders) {
        if (order.status === 'published')
            delivered++;
        if (order.status === 'processing' || order.status === 'pending')
            inProgress++;
        if (repeatClients.has(order.userId))
            repeatClient++;
        else
            newClient++;
    }
    const totalOrders = allOrders === null || allOrders === void 0 ? void 0 : allOrders.length;
    return {
        totalOrders,
        newClient,
        repeatClient,
        delivered,
        inProgress,
    };
});
exports.OrderService = {
    allOrders,
    createOrder,
    getOrderById: exports.getOrderById,
    updateOrder: exports.updateOrder,
    deleteOrder: exports.deleteOrder,
    getOrderStatistics
};
