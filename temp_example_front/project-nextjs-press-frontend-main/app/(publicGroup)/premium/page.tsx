import { Suspense } from "react";
import { NewsSearchBar } from "../_components/news/NewsSearchBar";
import { NewsFilter } from "../_components/news/NewsFilter";
import { NewsSkeleton } from "../_components/news/NewsSkeleton";
import { PremiumNewsList } from "../_components/news/PremiumNewsList";

const tagOptions = [
  { value: "technology", label: "Technology" },
  { value: "politics", label: "Politics" },
  { value: "sports", label: "Sports" },
  { value: "business", label: "Business" },
  { value: "entertainment", label: "Entertainment" },
  { value: "science", label: "Science" },
  { value: "health", label: "Health" },
  { value: "education", label: "Education" },
  { value: "culture", label: "Culture" },
];

const PremiumPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Premium News</h1>
          <p className="text-sm text-muted-foreground">
            Exclusive stories for our subscribers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <NewsFilter paramKey="tags" options={tagOptions} placeholder="All tags" />
          <NewsSearchBar />
        </div>
      </div>

      <Suspense fallback={<NewsSkeleton />}>
        <PremiumNewsList searchParams={searchParams} />
      </Suspense>
    </div>
  );
};

export default PremiumPage;
