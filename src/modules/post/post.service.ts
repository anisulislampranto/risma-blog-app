import { CommentStatus, Post, PostStatus } from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

const createPost = async (data: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'authorId'>, userId: string) => {
    const result = await prisma.post.create({
        data: {
            ...data,
            authorId: userId
        }
    })
    return result;
}

const getAllPosts = async (
    { search, tags, isFeatured, status, authorId, page, limit, skip, sortOrder, sortBy }:
        {
            search: string | undefined,
            tags: string[],
            isFeatured: boolean | undefined,
            status: PostStatus | undefined,
            authorId: string | undefined,
            page: number,
            limit: number,
            skip: number,
            sortBy: string,
            sortOrder: string,
        }) => {

    const andConditions: PostWhereInput[] = []

    if (search) {
        andConditions.push({
            OR: [
                {
                    title: {
                        contains: search,
                        mode: "insensitive"
                    }
                },
                {
                    content: {
                        contains: search,
                        mode: "insensitive"
                    }
                },
                {
                    tags: {
                        has: search
                    }
                }
            ]
        })
    }

    if (tags.length > 0) {
        andConditions.push({
            tags: {
                hasEvery: tags as string[]
            }
        })
    }

    if (typeof isFeatured === 'boolean') {
        andConditions.push({
            isFeatured
        })
    }

    if (status) {
        andConditions.push({
            status
        })
    }

    if (authorId) {
        andConditions.push({
            authorId
        })
    }

    const result = await prisma.post.findMany({
        take: limit,
        skip,
        where: {
            AND: andConditions
        },
        orderBy: {
            [sortBy]: sortOrder
        },
        include: {
            _count: {
                select: {
                    comments: true
                }
            }
        }
    })

    const totalCount = await prisma.post.count({
        where: {
            AND: andConditions
        },
    })

    return {
        data: result,
        pagination: {
            total: totalCount,
            page,
            limit,
            totalPages: Math.ceil(totalCount / limit)
        }
    };
}

const getPostById = async (postId: string) => {
    const result = await prisma.$transaction(async (tx) => {
        await tx.post.update({
            where: {
                id: postId
            },
            data: {
                views: {
                    increment: 1
                }
            }
        })

        const postData = await tx.post.findUnique({
            where: {
                id: postId
            },
            include: {
                _count: {
                    select: {
                        comments: true
                    }
                },
                comments: {
                    where: {
                        parentId: null,
                        status: CommentStatus.APPROVED
                    },
                    orderBy: {
                        createdAt: "desc"
                    },
                    include: {
                        replies: {
                            where: {
                                status: CommentStatus.APPROVED
                            },
                            orderBy: {
                                createdAt: 'asc'
                            },
                            include: {
                                replies: {
                                    where: {
                                        status: CommentStatus.APPROVED
                                    },
                                    orderBy: {
                                        createdAt: 'asc'
                                    },
                                }
                            }
                        }
                    }
                }
            }
        })

        return postData;
    })


    return result
}


const getMyPosts = async(authorId: string) => {
    await prisma.user.findUniqueOrThrow({
        where:{
            id: authorId,
            status: "ACTIVE"
        },
        select: {
            id: true,
        }
    })

    const result = await prisma.post.findMany({
        where: {
            authorId
        },
        orderBy: {
            createdAt: "desc"
        },
        include: {
            _count: {
                select: {
                    comments: true
                }
            }
        }
    })

    // const total = await prisma.post.count({
    //     where: {
    //         authorId
    //     },
    // })

    const total = await prisma.post.aggregate({
        _count: {
            id: true
        },
        where: {
            authorId
        },
    })

    return {
        data: result,
        total
    };
}

export const postService = {
    createPost,
    getAllPosts,
    getPostById,
    getMyPosts
}