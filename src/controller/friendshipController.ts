import { Request, Response } from "express";
import Friendship from "../models/friendshipModel"
import handle from 'express-async-handler';
import { IRequest } from "./authController";
import AppError from "../util/AppError";
import factory = require ('./factory');

export const addFriend = handle (async(req:Request, res:Response) : Promise<void> =>
{
    const id = req.params.id;
    const { user } = req as IRequest;

    if (await Friendship.findOne({a:id, b:user.id}) || await Friendship.findOne({a:user.id, b:id}))
        throw new AppError ('You are already friends', 400);

    const friendship = await Friendship.create ({a: user.id, b:id});

    res.status (200).json ({
        status: 'success',
        data: {
            friendship
        }
    })
});


export const getMyFriends = handle (async(req:Request, res:Response):Promise<void> =>
{
    const {user} = req as IRequest;
    const friends = factory.getAllFriends (user._id, false);

    res.status (200).json ({
        status: 'success',
        data :{
            friends
        }
    })
});