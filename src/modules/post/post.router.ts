import auth, { UserRole } from '../../middlewere/auth';
import { PostController } from './post.controller';
import express, { Router } from "express";

const router = express.Router();

router.post("/", auth(UserRole.USER), PostController.createPostController)

export const postRouter: Router = router;