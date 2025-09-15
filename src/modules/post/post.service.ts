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
    ].filter(Boolean),
  };

  const result = await prisma.post.findMany({
    skip,
    take: limit,
    where,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          phone: true,
          pictures: true,
          createdAt: true,
        },
      },
    },

    // TASK:1 make sort dynamic (title, createdAt, updatedAT, etc...)
    orderBy: {
      createdAt: "desc",
    },
  });

  const total = await prisma.post.count({ where });

  return {
    data: result,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getPostById = async (id: number) => {
  const result = await prisma.$transaction(async (tx) => {
    await tx.post.update({
      where: { id },
      data: {
        views: {
          increment: 1,
        },
      },
    });
    const postData = await tx.post.findFirstOrThrow({
      where: {
        id,
      },
    });
    return postData;
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

const getBlogStat = async () => {
  return await prisma.$transaction(async (tx) => {
    const aggregate = await tx.post.aggregate({
      _count: true,
      _sum: { views: true },
      _avg: { views: true },
      _max: { views: true },
      _min: { views: true },
    });

    const featuredCount = await tx.post.count({
      where: {
        isFeatured: true,
      },
    });

    const topFeatured = await tx.post.findFirst({
      where: {
        isFeatured: true,
      },
      orderBy: { views: "desc" },
    });

    return {
      stats: {
        totalPost: aggregate._count ?? 0,
        totalViews: aggregate._sum.views ?? 0,
        avgViews: aggregate._avg.views ?? 0,
        maxViews: aggregate._max.views ?? 0,
        minViews: aggregate._min.views ?? 0,
      },
      featured: {
        count: featuredCount,
        topPost: topFeatured,
      },
    };
  });
};

export const PostService = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  getBlogStat,
};
