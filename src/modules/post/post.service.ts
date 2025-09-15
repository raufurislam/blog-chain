import { Post, Prisma } from "@prisma/client";
import { prisma } from "../../config/db";

// const createPost = async (payload: Prisma.PostCreateInput): Promise<Post> => {
//   const tags = Array.isArray(payload.tags) // ✅ check if it's actually a string[]
//     ? payload.tags.map((tag: string) => tag.toLowerCase())
//     : payload.tags;

//   const result = await prisma.post.create({
//     data: {
//       ...payload,
//       tags, // safe to assign now
//     },
//     include: {
//       author: {
//         select: { id: true, name: true, email: true },
//       },
//     },
//   });
//   return result;
// };

const createPost = async (payload: Prisma.PostCreateInput): Promise<Post> => {
  const result = await prisma.post.create({
    data: payload,
    include: { author: { select: { id: true, name: true, email: true } } },
  });
  return result;
};

const getAllPosts = async ({
  page = 1,
  limit = 10,
  search,
  isFeatured,
  tags,
}: {
  page?: number;
  limit?: number;
  search?: string;
  isFeatured?: boolean;
  tags?: string[];
}) => {
  const skip = (page - 1) * limit;

  console.log({ tags });

  const where: any = {
    AND: [
      search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { content: { contains: search, mode: "insensitive" } },
        ],
      },
      typeof isFeatured === "boolean" && { isFeatured },
      tags && tags.length > 0 && { tags: { hasEvery: tags } },
      // tags && tags.length > 0 && { tags: { hasSome: tags } },
    ].filter(Boolean),
  };

  const result = await prisma.post.findMany({
    skip,
    take: limit,
    where,
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    data: result,
  };
};

const getPostById = async (id: number) => {
  const result = await prisma.post.findFirstOrThrow({
    where: {
      id,
    },
  });
  return result;
};

const updatePost = async (id: number, payload: Partial<Post>) => {
  const result = await prisma.post.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deletePost = async (id: number) => {
  const result = await prisma.post.delete({
    where: { id },
  });
  return result;
};

export const PostService = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
};
