import { Request, Response } from "express"
import { commentService } from "./comment.service"

const createCommentController = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        req.body.authorId = user?.id;
        const result = await commentService.createComment(req.body)

        res.status(201).json({
            data: result,
            message: 'Comment created successfully'
        })

    } catch (error) {
        res.status(400).json({
            data: [],
            error: 'Comment creation failed!',
            details: error
        })
    }
}

const getCommentById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        if (!id) {
            throw new Error("Comment id is required")
        }

        const result = await commentService.getCommentById(id)

        res.status(201).json({
            data: result,
            message: 'Comment fetched successfully'
        })

    } catch (error) {
        res.status(400).json({
            data: [],
            error: 'Comment fetch failed!',
            details: error
        })
    }
}

export const commentController = {
    createCommentController,
    getCommentById
}