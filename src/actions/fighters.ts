"use server";

import { prisma } from "@/lib/db";
import { Prisma } from "@/generated/prisma";

export async function getFighters({
  query = "",
  page = 1,
  limit = 8,
}: {
  query?: string;
  page?: number;
  limit?: number;
}) {
  const skip = (page - 1) * limit;

  const where: Prisma.FighterWhereInput = query
    ? {
        name: {
          contains: query,
          mode: "insensitive",
        },
      }
    : {};

  const [fighters, totalCount] = await Promise.all([
    prisma.fighter.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        eloRating: "desc",
      },
    }),
    prisma.fighter.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return {
    fighters,
    totalPages,
    currentPage: page,
  };
}

export async function getFighterById(id: string) {
  const fighter = await prisma.fighter.findUnique({
    where: { id },
  });

  return fighter;
}
