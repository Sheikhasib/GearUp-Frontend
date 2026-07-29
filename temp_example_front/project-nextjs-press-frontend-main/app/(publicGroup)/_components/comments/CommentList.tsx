"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { IComment } from "@/lib/types";
import { CommentItem } from "./CommentItem";
import { CommentForm } from "./CommentForm";
import {
  getComments,
  deleteComment,
  updateComment,
  moderateComment,
} from "@/app/(publicGroup)/_actions/commentActions";
import { toast } from "sonner";
import { MessageSquareIcon } from "lucide-react";

type CommentListProps = {
  postId: string;
  initialComments: IComment[];
  commentCount: number;
  currentUserId: string | null;
  currentUserRole: string | null;
  isLoggedIn: boolean;
};

const PER_PAGE = 10;

export function CommentList({
  postId,
  initialComments,
  commentCount,
  currentUserId,
  currentUserRole,
  isLoggedIn,
}: CommentListProps) {
  const [comments, setComments] = useState<IComment[]>(initialComments);
  const [visibleCount, setVisibleCount] = useState(PER_PAGE);
  const [loading, setLoading] = useState(false);

  const refreshComments = useCallback(async () => {
    setLoading(true);
    const result = await getComments(postId);
    if (result.success) {
      setComments(result.data);
      setVisibleCount(PER_PAGE);
    }
    setLoading(false);
  }, [postId]);

  const handleDelete = async (commentId: string) => {
    const result = await deleteComment(commentId, postId);
    if (result.success) {
      toast.success("Comment deleted.");
      refreshComments();
    } else {
      toast.error(result.message || "Failed to delete comment.");
    }
  };

  const handleUpdate = async (commentId: string, content: string) => {
    const result = await updateComment(commentId, postId, content);
    if (result.success) {
      toast.success("Comment updated.");
      refreshComments();
    } else {
      toast.error(result.message || "Failed to update comment.");
    }
  };

  const handleModerate = async (
    commentId: string,
    status: "APPROVED" | "REJECTED",
  ) => {
    const result = await moderateComment(commentId, postId, status);
    if (result.success) {
      toast.success(`Comment ${status.toLowerCase()}.`);
      refreshComments();
    } else {
      toast.error(result.message || "Failed to moderate comment.");
    }
  };

  const visibleComments = comments.slice(0, visibleCount);
  const hasMore = visibleCount < comments.length;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <MessageSquareIcon className="size-5" />
        Comments ({commentCount})
      </h2>

      <CommentForm
        postId={postId}
        isLoggedIn={isLoggedIn}
        onCommentCreated={refreshComments}
      />

      {comments.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground py-8">
          No comments yet. Be the first to share your thoughts.
        </p>
      ) : (
        <div className="space-y-4">
          {visibleComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUserId={currentUserId}
              currentUserRole={currentUserRole}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
              onModerate={handleModerate}
            />
          ))}
        </div>
      )}

      {hasMore && (
        <div className="flex justify-center pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setVisibleCount((prev) => prev + PER_PAGE)}
            disabled={loading}
          >
            {loading ? "Loading..." : "Load More Comments"}
          </Button>
        </div>
      )}
    </div>
  );
}
