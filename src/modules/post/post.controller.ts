import { Request, Response } from "express";
import { postService } from "./post.service";

const createPostController = async (req: Request, res: Response) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(400).json({
                error: 'Unauthorized!'
            })
        }

        const result = await postService.createPost(req.body, user.id as string)

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

const getAllPosts = async(req: Request, res: Response) => {
    try {
        const {search} = req.query;
        const searchString = typeof search === "string" ? search : undefined
        const tags = req.query.tags ? (req.query.tags as string).split(",") : [];
        const isFeatured = (req.query.isFeatured && req.query.isFeatured === 'true') ? true :
            (req.query.isFeatured && req.query.isFeatured === 'false') ? false
                : undefined;

        const result = await postService.getAllPosts({search: searchString, tags, isFeatured})

        res.status(201).json({
            data: result,
            message: 'Post Fetched successfully'
        })

    } catch (error) {
        res.status(400).json({
            data: [],
            error: 'Post fetch failed!',
            details: error
        })
    }
}   

export const PostController = {
    createPostController,
    getAllPosts
}