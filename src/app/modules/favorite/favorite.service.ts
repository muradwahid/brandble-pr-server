
import prisma from "../../../shared/prisma";

const allFavorites = async (userId: string): Promise<any[] | undefined> => {
  return await prisma.$transaction(async (tx) => {
    // Get publications

    const favoritesIds =  await tx.favorite.findMany({
      where: { userId: userId },
      include: {
        publication: true
      }
    });

    const favoriteIds = favoritesIds.map(item => item.publicationId);
    if (favoriteIds) {
      const publications = await tx.publication.findMany({
        where: {
          id: { in: favoriteIds }
        }
      });

      const allNicheIds = [...new Set(publications.flatMap(p => p.niches))];
      const niches = await tx.niche.findMany({
        where: {
          id: { in: allNicheIds }
        }
      });

     return  publications.map(publication => ({
        ...publication,
        niches: niches.filter(niche => publication.niches.includes(niche.id))
      }));
    }

  });
}
const getOnlyFavoriteIds = async (userId: string): Promise<any[] | null> => {
  const result = await prisma.favorite.findMany({
    where: { userId: userId },
    include: {
      publication: true
    }
  });

  const favoriteIds = result.map(item => item.publicationId);
  return favoriteIds;
}
const createFavorite = async (data: any): Promise<any> => {
  const { userId, itemId } = data;
  const result = await prisma.favorite.create({
    data: {
      userId: userId,
      publicationId:itemId
    }
  });
  return result;
}

const deleteFavorite = async (publicationId: string, userId: string): Promise<any> => {
  const favorite = await prisma.favorite.findFirst({
    where: {
      publicationId: publicationId,
      userId: userId
    }
  });

  if (!favorite) {
    throw new Error("Favorite not found");
  }

  // Then delete using the id
  const result = await prisma.favorite.delete({
    where: { id: favorite.id }
  });

  return result;
}


export const FavoriteService = {
  allFavorites,
  createFavorite,
  deleteFavorite,
  getOnlyFavoriteIds
}