import { Badge } from "@/components/ui/badge";
import { IPost } from "@/lib/types";
import { CalendarIcon, EyeIcon, ImageIcon, MessageSquareIcon, SparklesIcon, UserIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function isValidUrl(str: string) {
  try {
    return new URL(str).protocol.startsWith("http");
  } catch {
    return false;
  }
}

type NewsDetailProps = {
  post: IPost;
  commentCount?: number;
};

export function NewsDetail({ post, commentCount: explicitCount }: NewsDetailProps) {
  const commentCount = explicitCount ?? post._count?.comments ?? post.comments?.length ?? 0;

  return (
    <article className="mx-auto max-w-3xl space-y-8">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {post.isPremium && (
            <Badge>
              <SparklesIcon data-icon="inline-start" />
              Premium
            </Badge>
          )}
          {post.tags?.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>

        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          {post.author && (
            <span className="flex items-center gap-1.5">
              <UserIcon className="size-4" />
              {post.author.name}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <CalendarIcon className="size-4" />
            {new Date(post.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <span className="flex items-center gap-1.5">
            <EyeIcon className="size-4" />
            {post.views} views
          </span>
          <span className="flex items-center gap-1.5">
            <MessageSquareIcon className="size-4" />
            {commentCount} comments
          </span>
        </div>
      </div>

      {post.thumbnail && isValidUrl(post.thumbnail) ? (
        <div className="relative aspect-video overflow-hidden rounded-xl">
          <Image
            src={post.thumbnail}
            unoptimized
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
      ) : post.thumbnail ? (
        <div className="flex aspect-video items-center justify-center rounded-xl bg-muted">
          <ImageIcon className="size-10 text-muted-foreground" />
        </div>
      ) : null}

      <div className="whitespace-pre-line leading-relaxed text-foreground/90">
        {post.content}
      </div>

      <div className="border-t pt-4 text-sm text-muted-foreground">
        Last updated:{" "}
        {new Date(post.updatedAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </div>
    </article>
  );
}

export function NewsDetailSkeleton() {
  return (
    <div className="mx-auto max-w-3xl animate-pulse space-y-8">
      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="h-6 w-20 rounded-full bg-muted" />
          <div className="h-6 w-16 rounded-full bg-muted" />
        </div>
        <div className="h-10 w-3/4 rounded bg-muted" />
        <div className="h-10 w-1/2 rounded bg-muted" />
        <div className="flex gap-4">
          <div className="h-4 w-32 rounded bg-muted" />
          <div className="h-4 w-28 rounded bg-muted" />
          <div className="h-4 w-24 rounded bg-muted" />
        </div>
      </div>
      <div className="aspect-video rounded-xl bg-muted" />
      <div className="space-y-3">
        <div className="h-4 w-full rounded bg-muted" />
        <div className="h-4 w-full rounded bg-muted" />
        <div className="h-4 w-5/6 rounded bg-muted" />
        <div className="h-4 w-full rounded bg-muted" />
        <div className="h-4 w-4/5 rounded bg-muted" />
      </div>
    </div>
  );
}
