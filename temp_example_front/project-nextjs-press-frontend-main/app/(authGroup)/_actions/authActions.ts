"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt, { JwtPayload } from "jsonwebtoken";

type RegisterState = {
  success: true;
  statusCode: number;
  message: string;
  data: {
    user: {
      id: string;
      name: string;
      email: string;
      activeStatus: string;
      role: string;
      createdAt: string;
      updatedAt: string;
      profile: {
        id: string;
        profilePhoto: string;
        bio: string | null;
        userId: string;
        createdAt: string;
        updatedAt: string;
      };
    };
  };
};

type LoginState = {
  success: true;
  statusCode: number;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
};

// login action
export const loginAction = async (
  redirectTo: string,
  previousState: LoginState,
  formData: FormData,
) => {
  // console.log(formData);
  // console.log(previousState);

  // get the values from the form data object and store them in variables
  const email = formData.get("email");
  const password = formData.get("password");

  // create a payload object for the api call to login
  const payload = {
    email,
    password,
  };

  // make the api call from the backend server to login(get the access and refresh token)
  const res = await fetch(`${process.env.BACKEND_API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = await res.json();

  console.log(result);

  // if login is successful then set the cookies to store the access and refresh token
  if (result.success) {
    const cookieStore = await cookies();
    // set(name, value, options)
    cookieStore.set("accessToken", result.data.accessToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 24,
      sameSite: "lax",
    });
    cookieStore.set("refreshToken", result.data.refreshToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    });

    // decode the access token to get the user details
    const decodedToken = jwt.decode(result.data.accessToken) as JwtPayload;
    console.log(decodedToken, "decoded token");

    // After login, you will be taken to the page first, which you were trying to access before logging out
    if (
      redirectTo &&
      typeof redirectTo === "string" &&
      redirectTo.startsWith("/") &&
      !redirectTo.startsWith("//")
    ) {
      redirect(redirectTo);
    }

    // redirect to role based dashboard from login page
    if (decodedToken.role === "USER") {
      // redirect to dashboard from login page
      redirect("/dashboard");
    } else if (decodedToken.role === "ADMIN") {
      // redirect to admin dashboard from login page
      redirect("/admin-dashboard");
    } else if (decodedToken.role === "AUTHOR") {
      // redirect to author dashboard from login page
      redirect("/author-dashboard");
    }

    // redirect to dashboard from login page(replace -> no history, no back button)
    // redirect("/dashboard", "replace");
  }

  return result;
};

// register action
export const registerAction = async (
  previousState: RegisterState,
  formData: FormData,
) => {
  console.log(formData);
  console.log(previousState);

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const profilePhotoInput = formData.get("profilePhoto") as string;

  // mandatory field check — profilePhoto is intentionally excluded
  if (!name?.trim() || !email?.trim() || !password?.trim()) {
    return {
      success: false,
      message: "Name, email, and password are required",
    };
  }

  // password and confirm password should match
  if (password !== confirmPassword) {
    return {
      success: false,
      message: "Passwords do not match",
    };
  }

  // if user didn't paste a URL, auto-generate an avatar from their name
  const profilePhoto =
    profilePhotoInput?.trim() ||
    `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(name)}`;

  // create a payload object for the api call to register
  const payload = {
    name,
    email,
    password,
    profilePhoto,
  };

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = await res.json();

  // if registration is successful then redirect to login
  if (result.success) {
    redirect("/login");
  }

  return result;
};
