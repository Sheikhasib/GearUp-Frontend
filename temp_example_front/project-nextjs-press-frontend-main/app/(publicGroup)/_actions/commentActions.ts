"use server";

import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";
import { isAccessTokenExist } from "@/service/refreshToken";

export const getComments = async (postId: string) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  const res = await fetch(
    `${process.env.BACKEND_API_URL}/api/comments/${postId}`,
    {
      headers: accessToken
        ? { Cookie: `accessToken=${accessToken}` }
        : undefined,
      cache: "force-cache",
      next: {
        tags: [`comments-${postId}`],
      },
    },
  );

  const result = await res.json();
  return result;
};

export const createComment = async (postId: string, content: string) => {
  const accessToken = await isAccessTokenExist();

  if (!accessToken) {
    return { success: false, message: "You must be logged in to comment." };
  }

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `accessToken=${accessToken}`,
    },
    body: JSON.stringify({ content, postId }),
  });

  const result = await res.json();

  if (result.success) {
    revalidateTag(`comments-${postId}`, { expire: 0 });
    revalidateTag(`post-${postId}`, { expire: 0 });
  }

  return result;
};

export const deleteComment = async (commentId: string, postId: string) => {
  const accessToken = await isAccessTokenExist();

  if (!accessToken) {
    return { success: false, message: "Unauthorized." };
  }

  const res = await fetch(
    `${process.env.BACKEND_API_URL}/api/comments/${commentId}`,
    {
      method: "DELETE",
      headers: {
        Cookie: `accessToken=${accessToken}`,
      },
    },
  );

  const result = await res.json();

  if (result.success) {
    revalidateTag(`comments-${postId}`, { expire: 0 });
    revalidateTag(`post-${postId}`, { expire: 0 });
  }

  return result;
};

export const updateComment = async (
  commentId: string,
  postId: string,
  content: string,
) => {
  const accessToken = await isAccessTokenExist();

  if (!accessToken) {
    return { success: false, message: "Unauthorized." };
  }

  const res = await fetch(
    `${process.env.BACKEND_API_URL}/api/comments/${commentId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: `accessToken=${accessToken}`,
      },
      body: JSON.stringify({ content }),
    },
  );

  const result = await res.json();

  if (result.success) {
    revalidateTag(`comments-${postId}`, { expire: 0 });
  }

  return result;
};

export const moderateComment = async (
  commentId: string,
  postId: string,
  status: "APPROVED" | "REJECTED",
) => {
  const accessToken = await isAccessTokenExist();

  if (!accessToken) {
    return { success: false, message: "Unauthorized." };
  }

  const res = await fetch(
    `${process.env.BACKEND_API_URL}/api/comments/${commentId}/moderate`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: `accessToken=${accessToken}`,
      },
      body: JSON.stringify({ status }),
    },
  );

  const result = await res.json();

  if (result.success) {
    revalidateTag(`comments-${postId}`, { expire: 0 });
  }

  return result;
};
