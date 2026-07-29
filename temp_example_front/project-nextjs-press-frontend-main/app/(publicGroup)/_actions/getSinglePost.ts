"use server";

import { cookies } from "next/headers";

export const getSinglePost = async (postId: string) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  const res = await fetch(
    `${process.env.BACKEND_API_URL}/api/posts/${postId}`,
    {
      headers: accessToken
        ? { Cookie: `accessToken=${accessToken}` }
        : undefined,
      cache: "force-cache",
      next: {
        tags: [`post-${postId}`],
      },
    },
  );

  const result = await res.json();

  return result;
};
