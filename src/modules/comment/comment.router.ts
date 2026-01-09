import auth, { UserRole } from '../../middlewere/auth';
import express, { Router } from "express";
import { commentController } from './comment.controller';

const router = express.Router();

router.post("/", auth(UserRole.ADMIN, UserRole.USER), commentController.createCommentController)
router.get("/:id", auth(UserRole.ADMIN, UserRole.USER), commentController.getCommentById)

export const commentRouter: Router = router;