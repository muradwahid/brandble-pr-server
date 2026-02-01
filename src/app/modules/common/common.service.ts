import prisma from "../../../shared/prisma";

const getAllCommon = async (): Promise<any | null> => {
  const countries = await prisma.country.findMany();
  const cities =  await prisma.city.findMany();
  const states = await prisma.state.findMany();
  const genre = await prisma.genre.findMany();
  const dofollow = await prisma.doFollow.findMany();
  const indexed = await prisma.indexed.findMany();
  const niche = await prisma.niche.findMany({ orderBy: { title: 'asc'}});
  

  return {
    countries,
    cities,
    states,
    genre,
    dofollow,
    indexed,
    niche
  };
};

export const CommonService = { getAllCommon };