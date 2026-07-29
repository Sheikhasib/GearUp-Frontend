"use server";

import { cookies } from "next/headers";

export const getPremiumNews = async ({
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
  const accessToken = cookieStore.get("accessToken")?.value || null;

  if (!accessToken) {
    return {
      success: false,
      message: "User not logged in!",
    };
  }

  const res = await fetch(
    `${process.env.BACKEND_API_URL}/api/premium?${params.toString()}`,
    {
      headers: {
        Cookie: `accessToken=${accessToken}`,
      },
      cache: "no-cache",
      next: {
        revalidate: 60 * 60 * 6,
        tags: ["premium-posts"],
      },
    },
  );

  const result = await res.json();

  return result;
};
