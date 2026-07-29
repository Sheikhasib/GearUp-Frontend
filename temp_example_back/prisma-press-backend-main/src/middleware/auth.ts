import { NextFunction, Request, Response } from "express";
import { Role } from "../../generated/prisma/enums";
import { catchAsync } from "../utils/catchAsync";
import { jwtUtils } from "../utils/jwt";
import config from "../config";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../lib/prisma";

// auth(Role.USER, Role.ADMIN, Role.AUTHOR)
// auth() => ...requiredRoles => [Role.USER, Role.ADMIN, Role.AUTHOR]
const auth = (...requiredRoles: Role[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken
      ? req.cookies.accessToken
      : req.headers.authorization?.startsWith("Bearer")
        ? req.headers.authorization?.split(" ")[1]
        : req.headers.authorization;

    // 1. check if token is present or not
    if (!token) {
      throw new Error("You are not logged in. Please login to continue.");
    }

    // 2. verify token and get verifiedToken
    const verifiedToken = jwtUtils.verifyToken(token, config.jwt_access_secret);

    // 3. check if verifiedToken is not success
    if (!verifiedToken.success) {
      throw new Error(verifiedToken.error);
    }

    // Destructuring properties from verifiedToken
    const { id, name, email, role } = verifiedToken.data as JwtPayload;

    // 4. check if role is in requiredRoles array
    if (requiredRoles.length && !requiredRoles.includes(role)) {
      throw new Error(
        "Forbidden!!!. You are not authorized to access this route.",
      );
    }

    // 5. check if user exists
    const user = await prisma.user.findUnique({
      where: {
        id,
        email,
        name,
        role,
      },
    });

    // check if user is not found
    if (!user) {
      throw new Error("User not found.");
    }

    // 6. check if user is blocked
    if (user.activeStatus === "BLOCKED") {
      throw new Error("User is blocked. Please contact support service.");
    }

    // 7. add/attach user to request
    req.user = {
      id,
      name,
      email,
      role,
    };

    // call the next middleware otherwise the request will be blocked
    next();
  });
};

export default auth;
