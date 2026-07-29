"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createComment } from "@/app/(publicGroup)/_actions/commentActions";
import { toast } from "sonner";
import Link from "next/link";

type CommentFormProps = {
  postId: string;
  isLoggedIn: boolean;
  onCommentCreated: () => void;
};

export function CommentForm({
  postId,
  isLoggedIn,
  onCommentCreated,
}: CommentFormProps) {
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isLoggedIn) {
    return (
      <div className="rounded-lg border bg-muted/30 p-4 text-center text-sm text-muted-foreground">
        <Link
          href={`/login?redirectTo=/news/${postId}`}
          className="font-medium text-primary hover:underline"
        >
          Log in
        </Link>{" "}
        to comment.
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setSubmitting(true);
    const result = await createComment(postId, content.trim());
    setSubmitting(false);

    if (result.success) {
      setContent("");
      toast.success("Comment posted!");
      onCommentCreated();
    } else {
      toast.error(result.message || "Failed to post comment.");
    }
  };

  return (
    <div className="space-y-3">
      <textarea
        className="w-full resize-none rounded-lg border p-3 text-sm outline-none focus:ring-2 focus:ring-primary"
        rows={3}
        placeholder="Write a comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <Button
        onClick={handleSubmit}
        disabled={!content.trim() || submitting}
        size="sm"
      >
        {submitting ? "Posting..." : "Post Comment"}
      </Button>
    </div>
  );
}
