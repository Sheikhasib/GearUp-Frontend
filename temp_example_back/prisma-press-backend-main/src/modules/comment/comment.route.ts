import { Router } from "express";
import { commentController } from "./comment.controller";
import auth from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

// 1. Create comment
router.post(
  "/",
  auth(Role.USER, Role.ADMIN, Role.AUTHOR),
  commentController.createComment,
);

// 2. Get Comments By Author Id
router.get("/author/:authorId", commentController.getCommentsByAuthorId);

// 3. Get Comments By Post Id
router.get(
  // "/:commentId",
  "/:postId",
  commentController.getCommentsByPostId,
);

// 4. Update Comment
router.patch(
  "/:commentId",
  auth(Role.USER, Role.ADMIN, Role.AUTHOR),
  commentController.updateComment,
);

// 5. Delete Comment
router.delete(
  "/:commentId",
  auth(Role.USER, Role.ADMIN, Role.AUTHOR),
  commentController.deleteComment,
);

// 6. Moderate Comment
router.patch(
  "/:commentId/moderate",
  auth(Role.ADMIN),
  commentController.moderateComment,
);

export const commentRoutes = router;
