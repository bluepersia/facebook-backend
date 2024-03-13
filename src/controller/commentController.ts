import { Request, Response } from "express";
import Comment from "../models/commentModel";
import factory = require ('./factory');
import handle from 'express-async-handler';
import AppError from "../util/AppError";

export const getAllComments = factory.getAll (Comment);
export const createComment = factory.createOne (Comment);
export const getComment = factory.getOne (Comment);
export const deleteComment = factory.deleteOne (Comment);


export const setLevel = handle (async (req:Request, res:Response, next:() => void): Promise<void> =>
{
    if (req.body.comment)
    {
        const comment = await Comment.findById (req.body.comment);

        if (!comment)   
            throw new AppError ('Comment not found', 404);

        if (comment.level >= 2)
            throw new AppError ('Cannot comment on more than level 2', 400);

            req.body.level = comment.level + 1;
    }
    next ();
});