import { Request, Response } from "express";

const createPostController = async (req: Request, res: Response) => {
    console.log('Req', req);
    res.send('Created post')
}

export const PostController = {
    createPostController
}