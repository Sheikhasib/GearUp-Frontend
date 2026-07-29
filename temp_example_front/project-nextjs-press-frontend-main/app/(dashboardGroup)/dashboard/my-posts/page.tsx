import { Suspense } from "react";
import { PostFormDialog } from "../../_components/PostFormDialog";
import { MyPostsSkeleton } from "../../_components/MyPostSkeleton";
import { MyPostsList } from "../../_components/MyPostList";
import { NewsSearchBar } from "@/app/(publicGroup)/_components/news/NewsSearchBar";
import { NewsFilter } from "@/app/(publicGroup)/_components/news/NewsFilter";

const statusOptions = [
  { value: "DRAFT", label: "Draft" },
  { value: "PUBLISHED", label: "Published" },
  { value: "ARCHIVED", label: "Archived" },
];

const UserMyPostsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">My Posts</h1>
          <p className="text-sm text-muted-foreground">
            Create and manage your own news posts.
          </p>
        </div>
        <PostFormDialog mode="create" />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <NewsSearchBar />
        <NewsFilter
          paramKey="status"
          options={statusOptions}
          placeholder="All statuses"
        />
      </div>

      <Suspense fallback={<MyPostsSkeleton />}>
        <MyPostsList searchParams={searchParams} />
      </Suspense>
    </div>
  );
};

export default UserMyPostsPage;
