import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getSinglePost } from "@/app/(publicGroup)/_actions/getSinglePost";
import { getComments } from "@/app/(publicGroup)/_actions/commentActions";
import {
  NewsDetail,
  NewsDetailSkeleton,
} from "@/app/(publicGroup)/_components/news/NewsDetail";
import { CommentSection } from "@/app/(publicGroup)/_components/comments/CommentSection";
import { CommentSkeleton } from "@/app/(publicGroup)/_components/comments/CommentSkeleton";
import { IPost } from "@/lib/types";

const NewsByIdPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Suspense fallback={<NewsDetailSkeleton />}>
        <NewsDetailFetcher postId={id} />
      </Suspense>
    </div>
  );
};

async function NewsDetailFetcher({ postId }: { postId: string }) {
  const [postResult, commentsResult] = await Promise.all([
    getSinglePost(postId),
    getComments(postId),
  ]);

  if (!postResult.success) {
    notFound();
  }

  const post: IPost = postResult.data;
  const commentCount = commentsResult.success
    ? commentsResult.data.length
    : post._count?.comments ?? 0;

  return (
    <>
      <NewsDetail post={post} commentCount={commentCount} />
      <section className="mx-auto mt-12 max-w-3xl border-t pt-8">
        <Suspense fallback={<CommentSkeleton />}>
          <CommentSection postId={postId} />
        </Suspense>
      </section>
    </>
  );
}

export default NewsByIdPage;
