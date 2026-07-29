import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { IPost } from "@/lib/types";
import { ChevronRight, ImageIcon, MessageSquareIcon, SparklesIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function isValidUrl(str: string) {
  try {
    return new URL(str).protocol.startsWith("http");
  } catch {
    return false;
  }
}

type NewsCardProps = {
  post: IPost;
};

export function NewsCard({ post }: NewsCardProps) {
  const commentCount = post._count?.comments ?? post.comments?.length ?? 0;

  return (
    <Link href={`/news/${post.id}`} className="block h-full">
      <Card className="flex h-full flex-col gap-4 transition-shadow hover:shadow-md">
        {post.thumbnail && isValidUrl(post.thumbnail) ? (
          <Image
            src={post.thumbnail}
            unoptimized
            alt={post.title}
            width={400}
            height={400}
          />
        ) : post.thumbnail ? (
          <div className="flex aspect-video items-center justify-center bg-muted">
            <ImageIcon className="size-8 text-muted-foreground" />
          </div>
        ) : null}
        <CardHeader>
          <div className="flex flex-wrap items-center gap-1.5">
            {post.isPremium && (
              <Badge variant="default">
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
          <CardTitle className="text-lg">{post.title}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col space-y-3">
          <p className="line-clamp-4 flex-1 whitespace-pre-line text-muted-foreground">
            {post.content}
          </p>
        </CardContent>
        <CardFooter className="flex items-center justify-between border-t pt-(--card-spacing)">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>
              By {post.author?.name ?? "Unknown"} ·{" "}
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquareIcon className="size-3.5" />
              {commentCount}
            </span>
          </div>
          <Button size="sm" variant="outline" className="gap-1 text-primary" asChild>
            <span>
              Details <ChevronRight className="size-3.5" />
            </span>
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
