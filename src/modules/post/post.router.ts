import { Router } from "express";
import { PostController } from "./post.controller";

const router = Router();

router.post("/", PostController.createPost);

// get all posts
router.get("/", PostController.getAllPosts);

// get single post
router.get("/:id", PostController.getPostById);

// update post
router.patch("/:id", PostController.updatePost);

// delete post
router.delete("/:id", PostController.deletePost);

export const postRouter = router;
