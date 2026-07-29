import { NextFunction, Request, Response } from "express";
import { commentService } from "./comment.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

// 1. Create comment
const createComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const authorId = req.user?.id as string;

    const result = await commentService.createCommentIntoDB(payload, authorId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Comment created successfully",
      data: result,
    });
  },
);

// 2. Get Comments By Author Id
const getCommentsByAuthorId = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // const authorId = req.params.authorId;
    const authorId = req.user?.id as string;

    const result = await commentService.getCommentsByAuthorIdFromDB(
      authorId as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Comments fetched successfully",
      data: result,
    });
  },
);

// 3. Get Comments By Post Id
const getCommentsByPostId = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // const commentId = req.params.commentId;
    const { postId } = req.params;

    // If comment id is not provided
    if (!postId) {
      throw new Error("Post id is required");
    }

    const result = await commentService.getCommentsByPostIdFromDB(
      postId as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Comment fetched by post id successfully",
      data: result,
    });
  },
);

// 4. Update Comment
const updateComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id as string;
    const { commentId } = req.params;
    const payload = req.body;
    // const isAdmin = req.user?.role === "ADMIN";

    // If comment id is not provided
    if (!commentId) {
      throw new Error("Comment id is required");
    }

    // console.log({ commentId, authorId, payload });

    const result = await commentService.updateCommentIntoDB(
      commentId as string,
      payload,
      authorId,
      // isAdmin,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Comment updated successfully",
      data: result,
    });
  },
);

// 5. Delete Comment
const deleteComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id as string;
    // const commentId = req.params.commentId;
    const { commentId } = req.params;
    // const isAdmin = req.user?.role === "ADMIN";

    // If comment id is not provided
    if (!commentId) {
      throw new Error("Comment id is required");
    }

    await commentService.deleteCommentFromDB(
      commentId as string,
      authorId,
      // isAdmin,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Comment deleted successfully",
      data: null,
    });
  },
);

// 6. Moderate Comment
const moderateComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id as string;
    // const commentId = req.params.commentId;
    const { commentId } = req.params;
    const payload = req.body;
    // const isAdmin = req.user?.role === "ADMIN";

    // If comment id is not provided
    if (!commentId) {
      throw new Error("Comment id is required");
    }

    const result = await commentService.moderateCommentFromDB(
      commentId as string,
      payload,
      authorId,
      // isAdmin,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Comment moderated successfully",
      data: result,
    });
  },
);

export const commentController = {
  createComment,
  getCommentsByAuthorId,
  getCommentsByPostId,
  updateComment,
  deleteComment,
  moderateComment,
};
