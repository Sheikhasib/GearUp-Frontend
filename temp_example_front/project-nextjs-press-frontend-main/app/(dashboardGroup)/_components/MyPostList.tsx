/* eslint-disable @typescript-eslint/no-explicit-any */
import { IPost } from "@/lib/types";
import { getMyPosts } from "../_actions/myPostsActions";
import { MyPostCard } from "./MyPostCard";
import { Pagination } from "@/app/(publicGroup)/_components/news/Pagination";

type MyPostsListProps = {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function MyPostsList({ searchParams }: MyPostsListProps) {
  const query = searchParams ? await searchParams : {};
  const page = Number(query.page) || 1;
  const searchTerm = (query.searchTerm as string) || undefined;
  const status = (query.status as string) || undefined;

  const result = await getMyPosts({ page, searchTerm, status });

  if (!result.success || !result.data?.length) {
    return (
      <p className="py-12 text-center text-muted-foreground">
        You haven&apos;t created any posts yet.
      </p>
    );
  }

  const posts: IPost[] = result.data ?? [];
  const totalPages = result.meta?.totalPages ?? 1;

  const searchParamsRecord: Record<string, string> = {};
  if (searchTerm) searchParamsRecord.searchTerm = searchTerm;
  if (status) searchParamsRecord.status = status;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post: IPost | any) => (
          <MyPostCard key={post.id} post={post} />
        ))}
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        basePath="/dashboard/my-posts"
        searchParams={Object.keys(searchParamsRecord).length ? searchParamsRecord : undefined}
      />
    </div>
  );
}
