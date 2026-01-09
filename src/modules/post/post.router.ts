import auth, { UserRole } from '../../middlewere/auth';
import { PostController } from './post.controller';
import express, { Router } from "express";

const router = express.Router();

router.get('/', PostController.getAllPosts)
router.get("/my-posts", auth(UserRole.USER, UserRole.ADMIN), PostController.getMyPosts)
router.get("/:id", PostController.getPostById)
router.post("/", auth(UserRole.USER, UserRole.ADMIN), PostController.createPostController)

export const postRouter: Router = router;