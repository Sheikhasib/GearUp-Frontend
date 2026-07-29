import { Router } from "express";
import { postController } from "./post.controller";
import auth from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

// 1. Create post
router.post(
  "/",
  auth(Role.USER, Role.ADMIN, Role.AUTHOR),
  postController.createPost,
);

// 2. Get all posts
router.get("/", postController.getAllPosts);

// 3. Get Post Stats
router.get("/stats", auth(Role.ADMIN), postController.getPostStats);

// 4. Get My Posts
router.get(
  "/my-posts",
  auth(Role.USER, Role.ADMIN, Role.AUTHOR),
  postController.getMyPosts,
);

// 5. Get Post by id
router.get("/:postId", postController.getPostById);

// 6. Update Post by id
router.patch(
  "/:postId",
  auth(Role.USER, Role.ADMIN, Role.AUTHOR),
  postController.updatePostById,
);

// 7. Delete Post by id
router.delete(
  "/:postId",
  auth(Role.USER, Role.ADMIN, Role.AUTHOR),
  postController.deletePostById,
);

export const postRoutes = router;
