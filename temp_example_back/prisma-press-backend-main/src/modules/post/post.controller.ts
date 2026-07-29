import { NextFunction, Request, Response } from "express";
import { postService } from "./post.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

// 1. Create post
const createPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.user?.id as string;
    const payload = req.body;

    const result = await postService.createPostIntoDB(payload, id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Post created successfully",
      data: result,
    });
  },
);

// 2. Get all posts
const getAllPosts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;

    const result = await postService.getAllPostsFromDB(query);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All Posts are fetched successfully",
      data: result.data,
      meta: result.meta,
    });
  },
);

// 3. Get Post Stats
const getPostStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await postService.getPostStatsFromDB();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Post Stats are fetched successfully",
      data: result,
    });
  },
);

// 4. Get My Posts
const getMyPosts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id as string;

    const result = await postService.getMyPostsFromDB(authorId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "My Posts are fetched successfully",
      data: result,
    });
  },
);

// 5. Get Post by id
const getPostById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // From req.params we can get the post id
    const postId = req.params.postId;

    // If post id is not provided
    if (!postId) {
      throw new Error("Post id is required");
    }

    const result = await postService.getPostByIdFromDB(postId as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Post fetched successfully",
      data: result,
    });
  },
);

// 6. Update Post by id
const updatePostById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id as string;
    const isAdmin = req.user?.role === "ADMIN";
    const postId = req.params.postId;
    const payload = req.body;

    // If post id is not provided
    if (!postId) {
      throw new Error("Post id is required");
    }

    const result = await postService.updatePostByIdIntoDB(
      postId as string,
      payload,
      authorId,
      isAdmin,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Post updated successfully",
      data: result,
    });
  },
);

// 7. Delete Post by id
const deletePostById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id as string;
    const isAdmin = req.user?.role === "ADMIN";
    const postId = req.params.postId;

    // If post id is not provided
    if (!postId) {
      throw new Error("Post id is required");
    }

    await postService.deletePostByIdFromDB(postId as string, authorId, isAdmin);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Post deleted successfully",
      data: null,
    });
  },
);

export const postController = {
  createPost,
  getAllPosts,
  getPostStats,
  getMyPosts,
  getPostById,
  updatePostById,
  deletePostById,
};
