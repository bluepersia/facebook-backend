import { Request, Response } from 'express';
import handle from 'express-async-handler';
import { Model, Types } from 'mongoose';
import APIFeatures from '../util/APIFeatures';
import AppError from '../util/AppError';
import Friendship from '../models/friendshipModel';
import { IRequest } from './authController';

export const getAll = (Model:Model<any>) => handle (async (req:Request, res:Response) : Promise<void> =>
{
    const filter:{[key:string]:any} = {active: {$ne:false}};

    if (req.params.userId)
        filter.user = req.params.userId;

    if (req.params.postId)
        filter.post = req.params.postId;

    if (req.params.imageId)
        filter.image = req.params.imageId;


    const query = Model.find (filter);
    new APIFeatures (req.query, query).all ();
    const docs = await query;

    res.status (200).json ({
        status: 'success',
        data: {
            docs
        }
    })
}); 

export interface IRequestCreated extends Request
{
    onCreate: (id:string) => void
}
export const createOne = (Model:Model<any>) => handle (async (req:Request, res:Response) : Promise<void> =>
{
    if (req.params.userId)
        req.body.user = req.params.userId;

    if (req.params.postId)
        req.body.post = req.params.postId;

    if (req.params.imageId)
        req.body.image = req.params.imageId;

    const doc = await Model.create (req.body);

    const onCreate = (req as IRequestCreated).onCreate;


    if (onCreate != undefined)
        await onCreate (doc.id);

    res.status (201).json ({
        status: 'success',
        data: {
            doc
        }
    })
});

export const getOne = (Model:Model<any>) => handle (async (req:Request, res:Response) : Promise<void> =>
{
    const doc = await Model.findById (req.params.id);

    if (!doc || (doc.hasOwnProperty ('active') && !doc.active))
        throw new AppError ('No document found with that ID', 404);

    res.status (200).json ({
        status: 'success',
        data: {
            doc
        }
    })
});

export const updateOne = (Model:Model<any>) => handle (async (req:Request, res:Response) : Promise<void> =>
{
    const doc = await Model.findByIdAndUpdate (req.params.id, req.body, {new:true, runValidators:true});

    if (!doc)
        throw new AppError ('No document found with that ID', 404);

    res.status (200).json ({
        status: 'success',
        data: {
            doc
        }
    })
});

export const deleteOne = (Model:Model<any>) => handle (async (req:Request, res:Response) : Promise<void> =>
{
    
    const doc = await Model.findByIdAndDelete (req.params.id);

    if (!doc)
        throw new AppError ('No document found with that ID', 404);

    res.status (204).json ({
        status: 'success',
        data: null
    })
});


export const imageFilter = function (req:Request, file:Express.Multer.File, cb:Function) : void
{
    if (file.mimetype.startsWith ('image'))
        cb (null, true);
    else
        cb (new AppError ('Not an image. Please only use images.', 400), false);
}

export const getAllFriends = async function (userId:Types.ObjectId, includeMyself:boolean) : Promise<Types.ObjectId[]>
{
    const friends = (await Friendship.find ({$or: [{a: userId}, {b: userId}]})).map (friendship => friendship.a === userId ? friendship.b : friendship.a);

    if (includeMyself)
        friends.unshift (userId);

    return friends;


    
}



export const setMine = function (req:Request, res:Response, next:() => void) : void
{
    req.params.userId = (req as IRequest).user.id;
    next ();
}