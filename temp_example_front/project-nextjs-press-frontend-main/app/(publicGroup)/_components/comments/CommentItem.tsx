"use client";

import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IComment } from "@/lib/types";
import { Trash2Icon, PencilIcon, CheckIcon, XIcon } from "lucide-react";

type CommentItemProps = {
  comment: IComment;
  currentUserId: string | null;
  currentUserRole: string | null;
  onDelete: (commentId: string) => void;
  onUpdate: (commentId: string, content: string) => void;
  onModerate: (commentId: string, status: "APPROVED" | "REJECTED") => void;
};

export function CommentItem({
  comment,
  currentUserId,
  currentUserRole,
  onDelete,
  onUpdate,
  onModerate,
}: CommentItemProps) {
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const isOwn = currentUserId === comment.authorId;
  const isModerator =
    currentUserRole === "ADMIN" || currentUserRole === "AUTHOR";
  const isPending = comment.status === "PENDING";

  const handleSave = () => {
    if (!editContent.trim()) return;
    onUpdate(comment.id, editContent.trim());
    setEditing(false);
  };

  const handleCancel = () => {
    setEditContent(comment.content);
    setEditing(false);
  };

  return (
    <div className="flex gap-3 rounded-lg border p-4">
      <Avatar className="size-8 shrink-0">
        <AvatarFallback>{comment.authorId.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>

      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium">
            {isOwn ? "You" : `User ${comment.authorId.slice(0, 6)}`}
          </span>
          <span className="text-xs text-muted-foreground">
            {new Date(comment.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
          {isPending && (
            <Badge variant="outline" className="text-xs">
              Pending
            </Badge>
          )}
        </div>

        {editing ? (
          <div className="space-y-2">
            <textarea
              className="w-full resize-none rounded-md border p-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              rows={3}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                className="h-7 text-xs"
                onClick={handleSave}
                disabled={!editContent.trim()}
              >
                <CheckIcon className="size-3" />
                Save
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-foreground/90">{comment.content}</p>
        )}

        {!editing && (
          <div className="flex items-center gap-2 pt-1">
            {isOwn && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs text-muted-foreground hover:text-primary"
                  onClick={() => setEditing(true)}
                >
                  <PencilIcon className="size-3" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs text-muted-foreground hover:text-destructive"
                  onClick={() => onDelete(comment.id)}
                >
                  <Trash2Icon className="size-3" />
                  Delete
                </Button>
              </>
            )}

            {isModerator && isPending && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs text-green-600 hover:text-green-700"
                  onClick={() => onModerate(comment.id, "APPROVED")}
                >
                  <CheckIcon className="size-3" />
                  Approve
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs text-destructive"
                  onClick={() => onModerate(comment.id, "REJECTED")}
                >
                  <XIcon className="size-3" />
                  Reject
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
