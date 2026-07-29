"use server";

import { cookies } from "next/headers";

export const getPublicNews = async ({
  page = 1,
  searchTerm,
  tags,
}: {
  page?: number;
  searchTerm?: string;
  tags?: string;
} = {}) => {
  const params = new URLSearchParams();

  params.set("page", String(page));
  params.set("limit", "9");

  if (searchTerm) {
    params.set("searchTerm", searchTerm);
  }

  if (tags) {
    params.set("tags", JSON.stringify([tags]));
  }

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  const res = await fetch(
    `${process.env.BACKEND_API_URL}/api/posts?${params.toString()}`,
    {
      headers: accessToken
        ? { Cookie: `accessToken=${accessToken}` }
        : undefined,
      cache: "force-cache",
      next: {
        tags: ["public-posts"],
      },
    },
  );

  const result = await res.json();

  return result;
};
