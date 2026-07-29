/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { isAccessTokenExist } from "@/service/refreshToken";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

type PostState = {
  success: true;
  statusCode: number;
  message: string;
  data: Record<string, any>;
};

/*

    data : {
        title
        conten
    }
*/

export const createPost = async (prevState: PostState, formData: FormData) => {
  console.log({
    title: formData.get("title"),
    content: formData.get("content"),
    thumbnail: formData.get("thumbnail"),
    tags: (formData.get("tags") as string).split(", "), // to convert string to "array of strings"
    isPremium: formData.get("isPremium") === "on",
  });

  const payload = {
    title: formData.get("title"),
    content: formData.get("content"),
    thumbnail: formData.get("thumbnail"),
    tags: (formData.get("tags") as string).split(", "), // to convert string to "array of strings"
    isPremium: formData.get("isPremium") === "on", // to get the value of the checkbox field as boolean, we use === "on" because "on" means true and "off" means false
  };

  // const cookieStore = await cookies();

  // let accessToken = cookieStore.get("accessToken")?.value || null;
  // const refreshToken = cookieStore.get("refreshToken")?.value || null;

  // if (!accessToken && !refreshToken) {
  //     // throw new Error("User Not Logged In!");

  //     return {
  //         success: false,
  //         message: "User not logged in!"
  //     }
  // }

  // const decodedAccessToken = accessToken ? jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string) : null;

  // const decodedRefreshToken = refreshToken ? jwtUtils.verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET as string) : null;

  // if(!decodedAccessToken?.success && decodedRefreshToken?.success){
  //         //access token has expired but refresh token is valid, get new access token from backend
  //         const result = await getNewAccessToken();

  //         if(result.success){
  //             const newAccessToken = result.data.accessToken;

  //             cookieStore.set("accessToken", newAccessToken , {
  //                 httpOnly : true,
  //                 maxAge : 60 * 60 * 24,
  //                 sameSite : "lax",
  //             });

  //             accessToken = newAccessToken;

  //         }
  //     }

  // If we lose our access token while doing data fetch, then we can get our access token back through the refresh token and complete the data fetch.
  const accessToken = await isAccessTokenExist();

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/posts`, {
    method: "POST",
    headers: {
      // Authorization : accessToken as unknown as string,
      // Authorization : `${accessToken}`,
      // Authorization : `Bearer ${accessToken}`

      Cookie: `accessToken=${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = await res.json();

  // revalidate the cache for my-posts
  if (result.success) {
    revalidateTag("my-posts", {
      expire: 0, // 0 means revalidate immediately, 1day means revalidate after 1day
    });
  }

  // revalidate the cache for premium-posts or public-posts
  if (result.success && result.data.isPremium) {
    revalidateTag("premium-posts", {
      expire: 0, // 0 means revalidate immediately, 1day means revalidate after 1day
    });
  } else {
    revalidateTag("public-posts", {
      expire: 0,
    });
  }

  return result;
};

export const updatePost = async (
  postId: string,
  prevState: PostState,
  formData: FormData,
) => {
  console.log({
    postId,
  });
  console.log({
    title: formData.get("title"),
    content: formData.get("content"),
    thumbnail: formData.get("thumbnail"),
    tags: (formData.get("tags") as string).split(", "),
    isPremium: formData.get("isPremium") === "on",
  });

  const payload = {
    title: formData.get("title") ?? "",
    content: formData.get("content") ?? "",
    thumbnail: formData.get("thumbnail") ?? "",
    tags: (formData.get("tags") as string).split(", ") ?? "",
    isPremium: formData.get("isPremium") === "on",
  };

  // const cookieStore = await cookies();

  // let accessToken = cookieStore.get("accessToken")?.value || null;
  // const refreshToken = cookieStore.get("refreshToken")?.value || null;

  // if (!accessToken && !refreshToken) {
  //     // throw new Error("User Not Logged In!");

  //     return {
  //         success: false,
  //         message: "User not logged in!"
  //     }
  // }

  // const decodedAccessToken = accessToken ? jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string) : null;

  // const decodedRefreshToken = refreshToken ? jwtUtils.verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET as string) : null;

  // if (!decodedAccessToken?.success && decodedRefreshToken?.success) {
  //     //access token has expired but refresh token is valid, get new access token from backend
  //     const result = await getNewAccessToken();

  //     if (result.success) {
  //         const newAccessToken = result.data.accessToken;

  //         cookieStore.set("accessToken", newAccessToken, {
  //             httpOnly: true,
  //             maxAge: 60 * 60 * 24,
  //             sameSite: "lax",
  //         });

  //         accessToken = newAccessToken;

  //     }
  // }

  // If we lose our access token while doing data fetch, then we can get our access token back through the refresh token and complete the data fetch.
  const accessToken = await isAccessTokenExist();

  const res = await fetch(
    `${process.env.BACKEND_API_URL}/api/posts/${postId}`,
    {
      method: "PATCH",
      headers: {
        // Authorization : accessToken as unknown as string,
        // Authorization : `${accessToken}`,
        // Authorization : `Bearer ${accessToken}`

        Cookie: `accessToken=${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  const result = await res.json();

  if (result.success) {
    revalidateTag("my-posts", {
      expire: 0,
    });
  }

  if (result.success && result.data.isPremium) {
    revalidateTag("premium-posts", {
      expire: 0,
    });
  } else {
    revalidateTag("public-posts", {
      expire: 0,
    });
  }

  return result;
};

export const getMyPosts = async ({
  page = 1,
  searchTerm,
  status,
}: {
  page?: number;
  searchTerm?: string;
  status?: string;
} = {}) => {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value || null;

  if (!accessToken) {
    return {
      success: false,
      message: "User not logged in!",
    };
  }

  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", "9");

  if (searchTerm) {
    params.set("searchTerm", searchTerm);
  }

  if (status) {
    params.set("status", status);
  }

  const res = await fetch(
    `${process.env.BACKEND_API_URL}/api/posts/my-posts?${params.toString()}`,
    {
      headers: {
        Cookie: `accessToken=${accessToken}`,
      },
      cache: "force-cache",
      next: {
        revalidate: 60 * 60 * 24,
        tags: ["my-posts"],
      },
    },
  );

  const result = await res.json();

  return result;
};
