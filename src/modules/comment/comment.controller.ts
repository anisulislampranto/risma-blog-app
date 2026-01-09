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

const getCommentsByAuthor = async (req: Request, res: Response) => {
    try {
        const id = req.params.authorId;

        if (!id) {
            throw new Error("Author id is required")
        }

        const result = await commentService.getCommentsByAuthor(id)

        res.status(201).json({
            data: result,
            message: 'Author Comments fetched successfully'
        })

    } catch (error) {
        res.status(400).json({
            data: [],
            error: 'Author Comments fetch failed!',
            details: error
        })
    }
}

const deleteComment = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        if (!id) {
            throw new Error("Author id is required")
        }

        const userId = req.user?.id as string;

        const result = await commentService.deleteComment(id, userId)

        res.status(201).json({
            data: result,
            message: 'Comment deleted!'
        })

    } catch (error) {
        res.status(400).json({
            data: [],
            error: 'Comment delete failed!',
            details: error
        })
    }
}

const updateComment = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        if (!id) {
            throw new Error("Author id is required")
        }

        const userId = req.user?.id as string;

        const result = await commentService.updateComment(id, req.body, userId)

        res.status(201).json({
            data: result,
            message: 'Comment Updated!'
        })

    } catch (error) {
        res.status(400).json({
            data: [],
            error: 'Comment Update failed!',
            details: error
        })
    }
}

const moderateComment = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        if (!id) {
            throw new Error("comment id is required")
        }

        const result = await commentService.moderateComment(id, req.body)

        res.status(201).json({
            data: result,
            message: 'Comment Updated!'
        })

    } catch (error) {
        res.status(400).json({
            data: [],
            error: 'Comment Update failed!',
            details: error
        })
    }
}

export const commentController = {
    createCommentController,
    getCommentById,
    getCommentsByAuthor,
    deleteComment,
    updateComment,
    moderateComment
}