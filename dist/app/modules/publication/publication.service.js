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
exports.PublicationService = void 0;
const FileUploadHelper_1 = require("../../../helpers/FileUploadHelper");
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const publication_constant_1 = require("./publication.constant");
const createPublication = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    const uploadedProfileImage = yield FileUploadHelper_1.FileUploadHelper.uploadToCloudinary(file);
    const data = Object.assign({}, req.body);
    if (uploadedProfileImage && uploadedProfileImage.secure_url) {
        data.logo = uploadedProfileImage.secure_url;
    }
    //   if (uploadedProfileImage) {
    //       req.body..profileImage = uploadedProfileImage.secure_url;
    //   }
    const result = yield prisma_1.default.publication.create({
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
});
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
const getAllPublications = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    const { searchTerm, price = 'asc', title = 'asc', da = 'asc', dr = 'asc', genre = 'asc', sponsor = 'asc' } = filters, filterData = __rest(filters, ["searchTerm", "price", "title", "da", "dr", "genre", "sponsor"]);
    const andConditions = new Array();
    if (searchTerm) {
        andConditions.push({
            OR: publication_constant_1.publicationSearchableFields.map(field => ({
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
                        equals: filterData[key],
                    },
                };
            }),
        });
    }
    // Fixed: Create orderBy as an array of objects
    const orderBy = [];
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
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : undefined;
    const result = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const publication = yield transactionClient.publication.findMany({
            where: whereConditions,
            skip,
            take: limit,
            orderBy,
        });
        const newPublication = yield Promise.all(publication.map((publication) => __awaiter(void 0, void 0, void 0, function* () {
            const niches = yield transactionClient.niche.findMany({
                where: {
                    id: {
                        in: publication.niches
                    },
                },
            });
            return Object.assign(Object.assign({}, publication), { niches });
        })));
        return newPublication;
    }));
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
    const total = yield prisma_1.default.publication.count({
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
});
const getAllPublicationssss = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    // ✅ CORRECT: Use values directly without defaults
    const sortBy = options.sortBy; // No default
    const sortOrder = options.sortOrder; // No default
    // DEBUG: More detailed logging
    const andConditions = [];
    // ... (search and filter conditions remain same)
    // FIXED: Simplified and corrected orderBy logic
    let orderBy = { createdAt: 'desc' }; // Default fallback
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
    const result = yield prisma_1.default.publication.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy, // This should now work correctly
    });
    // If using array field for nicheIds instead of relation
    const publicationsWithNiches = yield Promise.all(result.map((publication) => __awaiter(void 0, void 0, void 0, function* () {
        if (publication.niches && publication.niches.length > 0) {
            const nicheDetails = yield prisma_1.default.niche.findMany({
                where: {
                    id: {
                        in: publication.niches
                    },
                },
            });
            return Object.assign(Object.assign({}, publication), { niches: nicheDetails });
        }
        return publication;
    })));
    const total = yield prisma_1.default.publication.count({
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
});
const getPublicationById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield prisma_1.default.publication.findUnique({
            where: {
                id,
            },
        });
        if (result === null || result === void 0 ? void 0 : result.niches) {
            const nicheDetails = yield prisma_1.default.niche.findMany({
                where: {
                    id: {
                        in: result === null || result === void 0 ? void 0 : result.niches
                    }
                }
            });
            result.niches = nicheDetails;
        }
        return result;
    }
    catch (error) {
        throw error;
    }
});
const updatePublication = (id, req) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    const data = Object.assign({}, req.body);
    if (file) {
        const uploadedProfileImage = yield FileUploadHelper_1.FileUploadHelper.uploadToCloudinary(file);
        if (uploadedProfileImage && uploadedProfileImage.secure_url) {
            data.logo = uploadedProfileImage.secure_url;
        }
    }
    try {
        const result = yield prisma_1.default.publication.update({
            where: {
                id,
            },
            data,
        });
        return result;
    }
    catch (error) {
        throw error;
    }
});
const deletePublication = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield prisma_1.default.publication.delete({
            where: {
                id,
            },
        });
        return result;
    }
    catch (error) {
        throw error;
    }
});
exports.PublicationService = {
    createPublication,
    getAllPublications,
    getPublicationById,
    updatePublication,
    deletePublication,
};
