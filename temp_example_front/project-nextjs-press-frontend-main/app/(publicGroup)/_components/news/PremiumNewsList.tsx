import { NewsCard } from "@/app/(publicGroup)/_components/news/NewsCard";
import { Pagination } from "@/app/(publicGroup)/_components/news/Pagination";
import { getPremiumNews } from "../../_actions/getPremiumNews";
import { IPost } from "@/lib/types";

export async function PremiumNewsList({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const query = searchParams ? await searchParams : {};
  const page = Number(query.page) || 1;
  const searchTerm = (query.searchTerm as string) || undefined;
  const tags = (query.tags as string) || undefined;

  const result = await getPremiumNews({ page, searchTerm, tags });

  if (!result.success) {
    return (
      <p className="py-12 text-center text-muted-foreground">
        Failed to load premium news. Please try again later.
      </p>
    );
  }

  const posts: IPost[] = result.data ?? [];
  const totalPages = result.meta?.totalPages ?? 1;

  if (!posts.length) {
    const message = searchTerm
      ? `No results found for "${searchTerm}".`
      : "No premium news found.";
    return (
      <p className="py-12 text-center text-muted-foreground">{message}</p>
    );
  }

  const searchParamsRecord: Record<string, string> = {};
  if (searchTerm) searchParamsRecord.searchTerm = searchTerm;
  if (tags) searchParamsRecord.tags = tags;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post: IPost) => (
          <NewsCard key={post.id} post={post} />
        ))}
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        basePath="/premium"
        searchParams={Object.keys(searchParamsRecord).length ? searchParamsRecord : undefined}
      />
    </div>
  );
}
