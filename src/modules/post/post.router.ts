import auth, { UserRole } from '../../middlewere/auth';
import { PostController } from './post.controller';
import express, { Router } from "express";

const router = express.Router();

router.get("/stats", auth(UserRole.ADMIN, UserRole.USER), PostController.getStats)
router.get('/', PostController.getAllPosts)
router.get("/my-posts", auth(UserRole.USER, UserRole.ADMIN), PostController.getMyPosts)
router.get("/:id", PostController.getPostById)
router.post("/", auth(UserRole.USER, UserRole.ADMIN), PostController.createPostController)

router.patch("/:id", auth(UserRole.ADMIN, UserRole.USER), PostController.updatePost)
router.delete("/:id", auth(UserRole.ADMIN, UserRole.USER), PostController.deletePost)

export const postRouter: Router = router;