import { Router } from "express";
import { PostController } from "./post.controller";

const router = Router();

router.post("/", PostController.createPost);

router.get("/", PostController.getAllPosts);

router.get("/stats", PostController.getBlogStat);

router.get("/:id", PostController.getPostById);

router.patch("/:id", PostController.updatePost);

router.delete("/:id", PostController.deletePost);

export const postRouter = router;
