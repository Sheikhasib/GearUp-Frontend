"use server";

import { cookies } from "next/headers";

export const getMe = async () => {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value; // to get a single value from cookies we need to use "cookies().get().value"

  if (!accessToken) {
    // throw new Error("Unauthorized User. Please Login with valid credentials.");

    return {
      success: false,
      message: "Unauthorized User. Please Login with valid credentials.",
    };
  }

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/users/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      //   Authorization: accessToken as unknown as string,
      //   Authorization: `${accessToken}`,
      //   Authorization: `Bearer ${accessToken}`,
      Cookie: `accessToken=${accessToken}`,
    },
    cache: "no-cache",
    next: {
      revalidate: 60 * 60 * 24,
      tags: ["my-profile"],
    },
  });

  const result = await res.json();

  console.log(result);

  return result;
};
