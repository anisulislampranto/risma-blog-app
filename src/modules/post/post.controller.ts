import { Request, Response } from "express";
import { postService } from "./post.service";

const createPostController = async (req: Request, res: Response) => {
    try {
        const result = await postService.createPost(req.body)

        res.status(201).json({
            data: result,
            message: 'Post created successfully'
        })

    } catch (error) {
        res.status(400).json({
            data: [],
            error: 'Post creation failed!',
            details: error
        })
    }
}

export const PostController = {
    createPostController
}