import { Request, Response } from "express";
import { postService } from "./post.service";
import { PostStatus } from "../../../generated/prisma/enums";

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

        const status = req.query.status as PostStatus | undefined
        const authorId = req.query.authorId as string | undefined

        const page = Number(req.query.page ?? 1)
        const limit = Number(req.query.limit ?? 1)

        const skip = (page - 1) * limit

        const sortBy = req.query.sortBy as string;
        const sortOrder = req.query.sortOrder as string


        const result = await postService.getAllPosts({
            search: searchString, tags, isFeatured, status, authorId, page, limit, skip,
            sortBy,
            sortOrder
        })

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