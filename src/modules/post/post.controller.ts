import { NextFunction, Request, Response } from "express";
import { postService } from "./post.service";
import { PostStatus } from "../../../generated/prisma/enums";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";
import { UserRole } from "../../middlewere/auth";

const createPostController = async (req: Request, res: Response, next: NextFunction) => {
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
        next(error)
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

        const options = paginationSortingHelper(req.query);
        const { page, limit, skip, sortBy, sortOrder } = options


        const result = await postService.getAllPosts({
            search: searchString, tags, isFeatured, status, authorId, page, limit, skip, sortBy, sortOrder
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

const getPostById = async(req: Request, res: Response) => {
    try {
        const id = req.params.id;

        if (!id) {
            throw new Error("Post id is required!")
        }

        const result = await postService.getPostById(id)

        res.status(201).json({
            data: result,
            message: 'Post Fetched successfully'
        })

    } catch (error) {
        res.status(400).json({
            data: [],
            error: 'Failed to fetch post by id!',
            details: error
        })
    }
}

const getMyPosts = async(req: Request, res: Response) => {
    try {
        const user = req.user;
        if (!user) {
            throw new Error("author id is required!")
        }

        const result = await postService.getMyPosts(user.id)

        res.status(200).json({
            data: result,
            message: 'My posts Fetched successfully'
        })

    } catch (error) {
        console.log('error', error);
        res.status(400).json({
            data: [],
            error: 'Failed to fetch my posts!',
            details: error
        })
    }
}


// user can update own posts, cannot update isFeatured post
// admin -> can update every post
const updatePost = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        const {id} = req.params;
        const isAdmin = user?.role === UserRole.ADMIN

        if (!user || !id) {
            throw new Error("author, post id is required!")
        }

        const result = await postService.updatePost(id, req.body, user.id, isAdmin)

        res.status(200).json({
            data: result,
            message: 'Post Updated successfully'
        })

    } catch (error) {
        next(error)
    }
}

const deletePost = async(req: Request, res: Response) => {
    try {
        const user = req.user;
        const {id} = req.params;
        const isAdmin = user?.role === UserRole.ADMIN

        if (!user || !id) {
            throw new Error("author, post id is required!")
        }

        const result = await postService.deletePost(id, user.id, isAdmin)

        res.status(200).json({
            data: result,
            message: 'Post deleted successfully'
        })

    } catch (error) {
        const errMessage = (error instanceof Error) ? error.message : 'Failed to delete post!'; 

        res.status(400).json({
            data: [],
            error: errMessage,
            details: error
        })
    }
}

const getStats = async(req: Request, res: Response) => {
    try {

        const result = await postService.getStats()

        res.status(200).json({
            data: result,
            message: 'Post Stats fetched successfully'
        })

    } catch (error) {
        const errMessage = (error instanceof Error) ? error.message : 'Failed to delete post!'; 

        res.status(400).json({
            data: [],
            error: errMessage,
            details: error
        })
    }
}

export const PostController = {
    createPostController,
    getAllPosts,
    getPostById,
    getMyPosts,
    updatePost,
    deletePost,
    getStats
}