import { Request, Response } from "express";
import User from "../models/userModel";
import AppError from "../util/AppError";
import factory = require ('./factory');
import handle from 'express-async-handler';
import { IRequest } from "./authController";
import multer from 'multer';
import sharp from 'sharp';

export const getAllUsers = factory.getAll (User);
export const createUser = () => { throw new AppError ('Route not defined. Use /signup instead', 400)}
export const getUser = factory.getOne (User);
export const updateUser = factory.updateOne (User);
export const deleteUser = factory.deleteOne (User);

const upload = multer ({
    storage: multer.memoryStorage (),
    fileFilter: factory.imageFilter
});

export const uploadProfile = upload.single ('profile');
export const uploadCover = upload.single ('cover');

export const processImages = handle (async(req:Request, res:Response, next:()=>void):Promise<void> =>
{
    if (!req.file)
        return next ();

    if (req.file.fieldname == 'profile')
    {
        req.body.imageProfile = `user-${(req as IRequest).user.id}-profile-${Date.now()}.jpeg`;

        await sharp (req.file.buffer)
        .resize (150, 150)
        .toFormat ('jpeg')
        .jpeg ({quality: 100})
        .toFile (`public/img/user/${req.body.imageProfile}`);
    }

    if (req.file.fieldname === 'cover')
    {
        req.body.imageCover = `user-${(req as IRequest).user.id}-cover-${Date.now()}.jpeg`;

        await sharp (req.file.buffer)
        .resize (1209, 654)
        .toFormat ('jpeg')
        .jpeg ({quality: 100})
        .toFile (`public/img/user/${req.body.imageCover}`);
    }

    next ();
});


export const updateMe = handle (async(req:Request, res:Response) : Promise<void> =>
{
    const body:{[key:string]:any} = {};

    ['email', 'name', 'imageProfile', 'imageCover'].forEach (key => { if (req.body[key]) body[key] = req.body[key]});

    const user = await User.findByIdAndUpdate ((req as IRequest).user.id, body, {new:true, runValidators:true});

    res.status (200).json ({
        status: 'success',
        data: {
            user
        }
    })
});     


export const deleteMe = handle (async(req:Request, res:Response) : Promise<void> =>
{
    await User.findByIdAndUpdate ((req as IRequest).user.id, {active: false});

    res.status (204).json ({
        status: 'success',
        data: null
    })
});