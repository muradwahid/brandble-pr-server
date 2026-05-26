"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavoriteService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const allFavorites = async (userId) => {
    const publications = await prisma_1.default.publication.findMany({
        where: {
            favorites: {
                some: {
                    userId: userId
                }
            }
        },
        include: {
            niches: true,
            countries: true,
            states: true,
            cities: true
        }
    });
    return publications;
    // return await prisma.$transaction(async (tx) => {
    //   // Get publications
    //   const favoritesIds =  await tx.favorite.findMany({
    //     where: { userId: userId },
    //     include: {
    //       publication: true
    //     }
    //   });
    //   const favoriteIds = favoritesIds.map(item => item.publicationId);
    //   if (favoriteIds) {
    //     const publications = await tx.publication.findMany({
    //       where: {
    //         id: { in: favoriteIds }
    //       }
    //     });
    //     const allNicheIds = [...new Set(publications.flatMap(p => p.niches))];
    //     const niches = await tx.niche.findMany({
    //       where: {
    //         id: { in: allNicheIds }
    //       }
    //     });
    //    return  publications.map(publication => ({
    //       ...publication,
    //       niches: niches.filter(niche => publication.niches.includes(niche.id))
    //     }));
    //   }
    // });
};
const getOnlyFavoriteIds = async (userId) => {
    const result = await prisma_1.default.favorite.findMany({
        where: { userId: userId },
        include: {
            publication: true
        }
    });
    const favoriteIds = result.map(item => item.publicationId);
    return favoriteIds;
};
const createFavorite = async (data) => {
    const { userId, itemId } = data;
    const existingFavorite = await prisma_1.default.favorite.findFirst({
        where: {
            userId: userId,
            publicationId: itemId
        }
    });
    if (existingFavorite) {
        await prisma_1.default.favorite.delete({
            where: {
                id: existingFavorite.id
            }
        });
        return {
            message: "Removed from favorites!"
        };
    }
    const result = await prisma_1.default.favorite.create({
        data: {
            userId: userId,
            publicationId: itemId
        }
    });
    return result;
};
const deleteFavorite = async (publicationId, userId) => {
    const favorite = await prisma_1.default.favorite.findFirst({
        where: {
            publicationId: publicationId,
            userId: userId
        }
    });
    if (!favorite) {
        throw new Error("Favorite not found");
    }
    // Then delete using the id
    const result = await prisma_1.default.favorite.delete({
        where: { id: favorite.id }
    });
    return result;
};
exports.FavoriteService = {
    allFavorites,
    createFavorite,
    deleteFavorite,
    getOnlyFavoriteIds
};
