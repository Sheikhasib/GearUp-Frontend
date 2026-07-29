import { CommentStatus, PostStatus } from "../../../generated/prisma/enums";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import {
  ICreatePostPayload,
  IPostQuery,
  IUpdatePostPayload,
} from "./post.interface";

// 1. Create Post
const createPostIntoDB = async (
  payload: ICreatePostPayload,
  userId: string,
) => {
  // Check if the user is a premium subscriber
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
    include: {
      subscription: true, // Include the subscription relation to check if the user has an active subscription
    },
  });

  // Check if the user has an active subscription before allowing them to create a premium post
  if (payload.isPremium && user.subscription?.status !== "ACTIVE") {
    throw new Error(
      "You are not a premium subscriber. Only subscribers can create premium posts",
    );
  }

  const result = await prisma.post.create({
    data: {
      ...payload,
      authorId: userId,
    },
  });

  return result;
};

// 2. Get all posts
const getAllPostsFromDB = async (query: IPostQuery) => {
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

  // To prevent "isPremium" posts from being shown to non-premium users. Because it's a paid feature for subscribers only.
  andConditions.push({
    isPremium: false,
  });

  const posts = await prisma.post.findMany({
    // Filtering / exact match without AND operator
    // where: {
    //   title: "My Today's 5th Post",
    //   content: "Messi",
    // },

    // Filtering / exact match with AND operator
    // where: {
    //   AND: [
    //     {
    //       title: "My Today's 5th Post",
    //     },
    //     {
    //       content: "Messi",
    //     },
    //     {
    //       tags: {
    //         // equals: ["typescript", "prisma", "express"],
    //         has: "typescript",
    //       },
    //     },
    //   ],
    // },

    // Searching / partial match
    // where: {
    //   title: {
    //     contains: "messi",
    //     mode: "insensitive", // case insensitive search
    //   },
    //   // Not ideal for partial match
    //   content: {
    //     contains: "Barcelona",
    //     mode: "insensitive",
    //   },
    // },

    // Searching / partial match with OR operator
    // where: {
    //   OR: [
    //     {
    //       title: {
    //         contains: "messi",
    //         mode: "insensitive",
    //       },
    //     },
    //     {
    //       content: {
    //         contains: "argentina",
    //         mode: "insensitive",
    //       },
    //     },
    //   ],
    // },

    // Combining filtering(AND operator) and searching(OR operator)
    // where: {
    //   // Searching & Filterig
    //   AND: [
    //     {
    //       // Searching
    //       OR: [
    //         {
    //           title: {
    //             contains: "mess",
    //             mode: "insensitive",
    //           },
    //         },
    //         {
    //           content: {
    //             contains: "arg",
    //             mode: "insensitive",
    //           },
    //         },
    //       ],
    //     },
    //     // Filtering
    //     {
    //       title: "Messi",
    //     },
    //     {
    //       content: "Barcelona",
    //     },
    //   ],
    // },

    // Pagination with (limit or take) and(skip or page)
    // take: 1,
    // take: 9,
    // for 1st page skip is 0
    // skip: 1, // visiting page 2
    // skip: 2, // visiting page 3
    // skip: 3, // visiting page 4
    // skip: 9, // visiting page 10
    // page = 10, limit/take = 1, skip => (page - 1) * limit = (10 - 1) * 1 = 9
    // page = 3, limit/take = 10, skip => (3 - 1) * 10 = 20

    // Sorting in ascending or descending order on specific fields
    // orderBy: {
    //   createdAt: "desc", // sort by createdAt in descending order
    //   title: "asc",
    //   content: "asc",
    //   // fieldName : asc | desc
    // },

    // Dynamic searching, filtering
    // where: {
    //   AND: [
    //     // searching with OR operator
    //     query.searchTerm
    //       ? {
    //           OR: [
    //             {
    //               title: {
    //                 contains: query.searchTerm,
    //                 mode: "insensitive",
    //               },
    //             },
    //             {
    //               content: {
    //                 contains: query.searchTerm,
    //                 mode: "insensitive",
    //               },
    //             },
    //           ],
    //         }
    //       : {},
    //     // title filtering
    //     query.title ? { title: query.title } : {},
    //     // content filtering
    //     query.content ? { content: query.content } : {},
    //   ],
    // },

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
    },
  });

  // Get total post count for pagination meta data
  const totalPostCount = await prisma.post.count({
    where: {
      AND: andConditions,
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

// 3. Get Post Stats
const getPostStatsFromDB = async () => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    //   const totalPosts = await tx.post.count();

    // const totalPublishedPosts = await tx.post.count({
    //   where: {
    //     status: PostStatus.PUBLISHED, // from PostStatus enum
    //   },
    // });

    // const totalDraftPosts = await tx.post.count({
    //   where: {
    //     status: PostStatus.DRAFT, // from PostStatus enum
    //   },
    // });

    // const totalArchivedPosts = await tx.post.count({
    //   where: {
    //     status: PostStatus.ARCHIVED, // from PostStatus enum
    //   },
    // });

    //   // Not a best practice
    //   // const allPosts = await tx.post.findMany();

    //   // let totalPostViews = 0;

    //   // allPosts.forEach((post) => {
    //   //   totalPostViews = totalPostViews + post.views;
    //   // });

    //   // Best practice
    // const totalPostViewsAggregate = await tx.post.aggregate({
    //   _sum: {
    //     views: true,
    //   },
    // });

    //   const totalPostViews = totalPostViewsAggregate._sum.views;

    //   const totalComments = await tx.comment.count();

    //   const totalApprovedComments = await tx.comment.count({
    //     where: {
    //       status: CommentStatus.APPROVED, // from CommentStatus enum
    //     },
    //   });

    //   const totalRejectedComments = await tx.comment.count({
    //     where: {
    //       status: CommentStatus.REJECTED, // from CommentStatus enum
    //     },
    //   });

    //   return {
    //     totalPosts,
    //     totalPublishedPosts,
    //     totalDraftPosts,
    //     totalArchivedPosts,
    //     totalPostViews,
    //     totalComments,
    //     totalApprovedComments,
    //     totalRejectedComments,
    //   };

    const [
      totalPosts,
      totalPublishedPosts,
      totalDraftPosts,
      totalArchivedPosts,
      totalPostViewsAggregate,
      totalComments,
      totalApprovedComments,
      totalRejectedComments,
    ] = await Promise.all([
      await tx.post.count(),
      await tx.post.count({
        where: {
          status: PostStatus.PUBLISHED, // from PostStatus enum
        },
      }),
      await tx.post.count({
        where: {
          status: PostStatus.DRAFT, // from PostStatus enum
        },
      }),
      await tx.post.count({
        where: {
          status: PostStatus.ARCHIVED, // from PostStatus enum
        },
      }),
      await tx.post.aggregate({
        _sum: {
          views: true,
        },
      }),
      await tx.comment.count(),
      await tx.comment.count({
        where: {
          status: CommentStatus.APPROVED, // from CommentStatus enum
        },
      }),
      await tx.comment.count({
        where: {
          status: CommentStatus.REJECTED, // from CommentStatus enum
        },
      }),
    ]);

    return {
      totalPosts,
      totalPublishedPosts,
      totalDraftPosts,
      totalArchivedPosts,
      totalPostViews: totalPostViewsAggregate._sum.views,
      totalComments,
      totalApprovedComments,
      totalRejectedComments,
    };
  });

  return transactionResult;
};

// 4. Get My Posts
const getMyPostsFromDB = async (authorId: string) => {
  const myPosts = await prisma.post.findMany({
    where: {
      authorId,
    },
    orderBy: {
      createdAt: "desc", // sort by createdAt in descending order
    },
    include: {
      comments: true,
      author: {
        omit: {
          password: true,
        },
      },
      // count comments
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });

  return myPosts;
};

// 5. Get Post by id
const getPostByIdFromDB = async (postId: string) => {
  // await prisma.post.update({
  //   where: {
  //     id: postId,
  //   },
  //   data: {
  //     views: {
  //       increment: 1,
  //     },
  //   },
  // });

  // throw new Error("Fake error");

  // const post = await prisma.post.findUniqueOrThrow({
  //   where: {
  //     id: postId,
  //   },
  //   include: {
  //     author: {
  //       omit: {
  //         password: true,
  //       },
  //     },
  //     comments: {
  //       where: {
  //         status: CommentStatus.APPROVED, // only approved comments will be shown
  //       },
  //       orderBy: {
  //         createdAt: "desc", //
  //       },
  //     },
  //     _count: {
  //       select: {
  //         comments: true,
  //       },
  //     },
  //   },
  // });

  // return post;

  const transactionResult = await prisma.$transaction(async (tx) => {
    await tx.post.update({
      where: {
        id: postId,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });

    // throw new Error("Fake error");

    const post = await tx.post.findUniqueOrThrow({
      where: {
        id: postId,
        isPremium: false, // To prevent "isPremium" posts from being shown to non-premium users. Because it's a paid feature for subscribers only.
      },
      include: {
        author: {
          omit: {
            password: true,
          },
        },
        comments: {
          where: {
            status: CommentStatus.APPROVED, // only approved comments will be shown
          },
          orderBy: {
            createdAt: "desc", // sort by createdAt in descending order
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    return post;
  });

  return transactionResult;
};

// 6. Update Post by id
const updatePostByIdIntoDB = async (
  postId: string,
  payload: IUpdatePostPayload,
  authorId: string,
  isAdmin: boolean,
) => {
  // First Check if the post exists
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });

  // Check if the user is authorized to update the post or not
  if (post.authorId !== authorId && !isAdmin) {
    throw new Error("You are not authorized to update this post");
  }

  const result = await prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      ...payload,
    },
    include: {
      author: {
        omit: {
          password: true,
        },
      },
      comments: true,
    },
  });

  return result;
};

// 7. Delete Post by id
const deletePostByIdFromDB = async (
  postId: string,
  authorId: string,
  isAdmin: boolean,
) => {
  // First Check if the post exists
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });

  // Check if the user is authorized to delete the post or not
  if (post.authorId !== authorId && !isAdmin) {
    throw new Error("You are not authorized to delete this post");
  }

  await prisma.post.delete({
    where: {
      id: postId,
    },
  });

  // Return null to indicate that the post has been deleted
};

export const postService = {
  createPostIntoDB,
  getAllPostsFromDB,
  getPostStatsFromDB,
  getMyPostsFromDB,
  getPostByIdFromDB,
  updatePostByIdIntoDB,
  deletePostByIdFromDB,
};
