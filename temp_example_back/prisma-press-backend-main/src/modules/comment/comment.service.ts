import { Payload } from "./../../../generated/prisma/internal/prismaNamespace";
import { prisma } from "../../lib/prisma";
import {
  ICreateCommentPayload,
  IModerateCommentPayload,
  IUpdateCommentPayload,
} from "./comment.interface";

// 1. Create comment
const createCommentIntoDB = async (
  payload: ICreateCommentPayload,
  authorId: string,
) => {
  // First Check if the post exists
  await prisma.post.findUniqueOrThrow({
    where: {
      id: payload.postId,
    },
  });

  // Then create the comment
  const result = await prisma.comment.create({
    data: {
      ...payload,
      authorId: authorId,
    },
    // include: {
    //   post: {
    //     select: {
    //       id: true,
    //       title: true,
    //     },
    //   },
    // },
  });

  return result;
};

// 2. Get Comments By Author Id
const getCommentsByAuthorIdFromDB = async (authorId: string) => {
  const comments = await prisma.comment.findMany({
    where: {
      authorId: authorId,
    },
    orderBy: {
      createdAt: "desc", // sort by createdAt in descending order
    },
    include: {
      post: {
        select: {
          id: true,
          title: true,
        },
      },
      // _count: {
      //   select: {
      //     comments: true,
      //   },
      // },
    },
  });

  return comments;
};

// 3. Get Comments By Post Id
const getCommentsByPostIdFromDB = async (postId: string) => {
  const comment = await prisma.comment.findMany({
    where: {
      postId,
    },
  });

  return comment;
};

// 4. Update Comment
const updateCommentIntoDB = async (
  commentId: string,
  payload: IUpdateCommentPayload,
  authorId: string,
) => {
  // const check = await prisma.comment.findUnique({ where: { id: commentId } });
  // console.log("Actual comment in DB:", check);

  const commentData = await prisma.comment.findUniqueOrThrow({
    where: {
      id: commentId,
      authorId,
    },
    select: {
      id: true,
    },
  });

  // Check if the user is authorized to update the comment or not
  // if (comment.authorId !== authorId && !isAdmin) {
  //   throw new Error("You are not authorized to update this comment");
  // }

  // if (!commentData) {
  //   throw new Error("Your Provided Input is Invalid");
  // }

  const updatedComment = await prisma.comment.update({
    where: {
      id: commentId,
      authorId,
    },
    data: {
      ...payload,
    },
  });

  return updatedComment;
};

// 5. Delete Comment
const deleteCommentFromDB = async (
  commentId: string,
  authorId: string,
  // isAdmin: boolean,
) => {
  const commentData = await prisma.comment.findUniqueOrThrow({
    where: {
      id: commentId,
      authorId,
    },
    select: {
      id: true,
    },
  });

  // Check if the user is authorized to delete the comment or not
  // if (comment.authorId !== authorId && !isAdmin) {
  //   throw new Error("You are not authorized to delete this comment");
  // }

  // if (!commentData) {
  //   throw new Error("Your Provided Input is Invalid");
  // }

  await prisma.comment.delete({
    where: {
      // id: commentId,
      id: commentData.id,
    },
  });
};

// 6. Moderate Comment
const moderateCommentFromDB = async (
  commentId: string,
  payload: IModerateCommentPayload,
  authorId: string,
  // isAdmin: boolean,
) => {
  const comment = await prisma.comment.findUniqueOrThrow({
    where: {
      id: commentId,
    },
    select: {
      id: true,
      status: true,
    },
  });

  // Check if the user is authorized to moderate the comment or not
  // if (comment.authorId !== authorId && !isAdmin) {
  //   throw new Error("You are not authorized to moderate this comment");
  // }

  // Check if the comment is already moderated or not
  if (comment.status === payload.status) {
    throw new Error(
      `Your provided status is already (${payload.status}) up to date`,
    );
  }

  const moderatedComment = await prisma.comment.update({
    where: {
      id: commentId,
    },
    data: {
      ...payload,
    },
    // include: {
    //   author: {
    //     omit: {
    //       password: true,
    //     },
    //   },
    //   post: true,
    // },
  });

  return moderatedComment;
};

export const commentService = {
  createCommentIntoDB,
  getCommentsByAuthorIdFromDB,
  getCommentsByPostIdFromDB,
  updateCommentIntoDB,
  deleteCommentFromDB,
  moderateCommentFromDB,
};
