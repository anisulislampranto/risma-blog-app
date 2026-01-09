import auth, { UserRole } from '../../middlewere/auth';
import express, { Router } from "express";
import { commentController } from './comment.controller';

const router = express.Router();

router.post("/", auth(UserRole.ADMIN, UserRole.USER), commentController.createCommentController)
router.get("/:id", auth(UserRole.ADMIN, UserRole.USER), commentController.getCommentById)
router.get("/author/:authorId", auth(UserRole.ADMIN, UserRole.USER), commentController.getCommentsByAuthor)
router.delete("/:id", auth(UserRole.ADMIN, UserRole.USER), commentController.deleteComment)

export const commentRouter: Router = router;