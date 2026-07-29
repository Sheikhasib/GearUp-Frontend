import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { catchAsync } from "../../utils/catchAsync";
import { ILoginUser } from "./auth.interface";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import config from "../../config";
import { jwtUtils } from "../../utils/jwt";

// Login user
const loginUser = async (payload: ILoginUser) => {
  const { email, password } = payload;

  //   const user = await prisma.user.findUnique({
  //     where: {
  //       email,
  //     },
  //   });

  //   if (!user) {
  //     throw new Error("User not found");
  //   }

  // check if user exists, if not throw error
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email,
    },
  });

  // check if user is blocked
  if (user.activeStatus === "BLOCKED") {
    throw new Error("User is blocked. Please contact support service.");
  }

  // check if password matches, if not throw error
  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    throw new Error("Invalid credentials");
  }

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  // const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret, {
  //   expiresIn: config.jwt_access_expires_in,
  // } as SignOptions);

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret,
    { expiresIn: config.jwt_access_expires_in } as SignOptions,
  );

  // const refreshToken = jwt.sign(jwtPayload, config.jwt_refresh_secret, {
  //   expiresIn: config.jwt_refresh_expires_in,
  // } as SignOptions);

  const refreshToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_refresh_secret,
    { expiresIn: config.jwt_refresh_expires_in } as SignOptions,
  );

  return { accessToken, refreshToken };
};

// Refresh token
const refreshToken = async (refreshToken: string) => {
  // verify refresh token
  const verifiedToken = jwtUtils.verifyToken(
    refreshToken,
    config.jwt_refresh_secret,
  );

  // check if verifiedToken is not success
  if (!verifiedToken.success) {
    throw new Error(verifiedToken.error);
  }

  // Destructuring properties from verifiedToken
  const { id } = verifiedToken.data as JwtPayload;

  // check if user is blocked or not
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  });

  if (user.activeStatus === "BLOCKED") {
    throw new Error("User is blocked. Please contact support service.");
  }

  // create jwt payload for access token
  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  // create access token
  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret,
    { expiresIn: config.jwt_access_expires_in } as SignOptions,
  );

  return { accessToken };
};

export const authService = {
  loginUser,
  refreshToken,
};
