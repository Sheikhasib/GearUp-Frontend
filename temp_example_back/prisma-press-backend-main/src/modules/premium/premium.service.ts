import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { IPostQuery } from "../post/post.interface";

// Get Premium Content
const getPremiumContent = async (query: IPostQuery) => {
  // Pagination
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;

  // Sorting
  const sortBy = query.sortBy ? query.sortBy : "createdAt";
  const sortOrder = query.sortOrder ? query.sortOrder : "desc";

  // Tags Array from query
  const tags = query.tags ? JSON.parse(query.tags as string) : null;
  const tagsArray = Array.isArray(tags) ? tags : [];

  // Dynamic Searching and Filtering
  const andConditions: PostWhereInput[] = [];

  // Searching Conditions/Partial Match
  if (query.searchTerm) {
    andConditions.push({
      OR: [
        {
          title: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  // Filtering Condition/Exact Match
  if (query.title) {
    andConditions.push({
      title: query.title,
    });
  }
  // Filtering Condition/Exact Match
  if (query.content) {
    andConditions.push({
      content: query.content,
    });
  }

  // Filtering Condition/Exact Match
  if (query.authorId) {
    andConditions.push({
      authorId: query.authorId,
    });
  }

  // Filtering Condition/Exact Match
  if (query.isFeatured) {
    andConditions.push({
      isFeatured: Boolean(query.isFeatured), // Boolean(true) => true, Boolean(false) => false
    });
  }

  // Filtering Condition/Exact Match
  if (query.tags) {
    andConditions.push({
      tags: {
        // hasSome: JSON.parse(query.tags as string), // string[] => ["typescript", "prisma", "express"]
        hasSome: tagsArray,
      },
    });
  }

  // Filtering Condition/Exact Match
  if (query.status) {
    andConditions.push({
      status: query.status,
    });
  }

  // isPremium will be always true
  andConditions.push({
    isPremium: true,
  });

  // Get total post count for pagination meta data
  const totalPostCount = await prisma.post.count({
    where: {
      AND: andConditions,
    },
  });

  // Fetch all posts that are marked as "isPremium: true"
  const posts = await prisma.post.findMany({
    where: {
      AND: andConditions,
    },

    // Dynamic Pagination
    take: limit,
    skip: skip,

    // Dynamic Sorting
    orderBy: {
      // [sortBy] : sortOrder
      [sortBy]: sortOrder,
    },

    include: {
      author: {
        omit: {
          password: true,
        },
      },
      comments: true,
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });

  return {
    data: posts,
    meta: {
      page: page,
      limit: limit,
      total: totalPostCount,
      totalPages: Math.ceil(totalPostCount / limit),
    },
  };
};

export const premiumService = {
  getPremiumContent,
};
