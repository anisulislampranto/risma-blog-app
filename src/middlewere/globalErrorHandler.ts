import { PrismaClientValidationError } from "@prisma/client/runtime/client";
import { NextFunction, Request, Response } from "express"

export default function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    let statusCode = 500;
    let errorMessage = 'Internal server Error'
    let errorDetails = err

    // prisma client validation error
    if (err instanceof PrismaClientValidationError) {
        statusCode = 400;
        errorMessage = 'You have provided incorrect field type or missing fields!';
    }

    res.status(statusCode)
    res.json({
        message: errorMessage,
        error: errorDetails
    })
}
