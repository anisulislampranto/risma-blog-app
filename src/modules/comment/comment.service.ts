import { CommentStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const createComment = async (
    payload
        :
        {
            content: string,
            authorId: string,
            postId: string,
            parentId?: string
        }
) => {
    await prisma.post.findUniqueOrThrow({
        where: {
            id: payload.postId
        }
    })

    if (payload.parentId) {
        await prisma.comment.findUniqueOrThrow({
            where: {
                id: payload.parentId
            }
        })
    }

    return await prisma.comment.create({
        data: payload
    })
}

const getCommentById = async (commentId: string) => {
    return await prisma.comment.findUnique({
        where: {
            id: commentId
        },
        include: {
            post: {
                select: {
                    id: true,
                    title: true,
                    views: true
                }
            }
        }
    })
}

const getCommentsByAuthor = async (authorId: string) => {
    return await prisma.comment.findMany({
        where: {
            authorId
        },
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            post: {
                select: {
                    id: true,
                    title: true
                }
            }
        }
    })
}


// conditions
// should be logged in
// can delete own comment
const deleteComment = async (commentId: string, authorId: string) => {
    const commentData = await prisma.comment.findFirst({
        where: {
            id: commentId,
            authorId
        },
        select: {
            id: true
        }
    })

    if (!commentData) {
        throw new Error("Comment does not exist!")
    }

    const result = await prisma.comment.delete({
        where: {
            id: commentData.id
        }
    })

    return result
}

const updateComment = async (commentId: string, data: { content?: string, status?: CommentStatus }, authorId: string) => {
    const commentData = await prisma.comment.findFirst({
        where: {
            id: commentId,
            authorId
        },
        select: {
            id: true
        }
    })

    if (!commentData) {
        throw new Error("Comment does not exist!")
    }

    return prisma.comment.update({
        where: {
            id: commentData.id,
            authorId
        },
        data
    })
}

const moderateComment = async (commentId: string, data: { status: CommentStatus }) => {
    const commentData = await prisma.comment.findFirstOrThrow({
        where: {
            id: commentId,
        },
        select: {
            status: true,
            id: true
        }
    })

    if (!commentData) {
        throw new Error("Comment does not exist!")
    }

    if (commentData.status === data.status) {
        throw new Error(`${data.status} is already up to date!`)
    }

    return prisma.comment.update({
        where: {
            id: commentData.id,
        },
        data
    })
}

export const commentService = {
    createComment,
    getCommentById,
    getCommentsByAuthor,
    deleteComment,
    updateComment,
    moderateComment
}