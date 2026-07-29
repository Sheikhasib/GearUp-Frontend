import { PostStatus } from "../../../generated/prisma/enums";
import { PostWhereInput } from "../../../generated/prisma/models";

export interface ICreatePostPayload {
  title: string;
  content: string;
  thumbnail?: string;
  isFeatured?: boolean;
  isPremium?: boolean;
  status?: PostStatus;
  tags: string[];
}

export interface IUpdatePostPayload {
  title?: string;
  content?: string;
  thumbnail?: string;
  isFeatured?: boolean;
  isPremium?: boolean;
  status?: PostStatus;
  tags?: string[];
}

export interface IDeletePostPayload {
  title?: string;
  content?: string;
  thumbnail?: string;
  isFeatured?: boolean;
  isPremium?: boolean;
  status?: PostStatus;
  tags?: string[];
}

export interface IPostQuery extends PostWhereInput {
  // title?: string;
  // content?: string;
  // isFeatured?: boolean;
  // status?: PostStatus;
  // tags?: string[];

  page?: string;
  limit?: string;

  sortBy?: string;
  sortOrder?: string;

  searchTerm?: string;
}
