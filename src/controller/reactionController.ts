import { Request, Response } from "express";
import Reaction from "../models/reactionModel";
import factory = require ('./factory');
import handle from 'express-async-handler';
import { IRequest } from "./authController";

export const getAllReactions = factory.getAll (Reaction);


export const toggleLike = handle (async (req:Request, res:Response) : Promise<void> =>
{
    const key = req.body.target;
    let like = await Reaction.findOne ({user: (req as IRequest).user.id, [key]:req.body.targetId});

    if (like)
    {
        await Reaction.findByIdAndDelete (like.id);

        res.status (204).json ({
            status: 'success',
            data: null
        })
        return;
    }

    like = await Reaction.create ({[key]:req.body.targetId, user:(req as IRequest).user.id})

    res.status (200).json ({
        status: 'success',
        data: {
            like
        }
    })

});