import Post from "../models/postModel";
import factory = require ('./factory');
import multer = require("multer");
import sharp from 'sharp';
import handle from 'express-async-handler';
import { Request, Response } from "express";

export const getAllPosts = factory.getAll (Post);
export const createPost = factory.createOne (Post);
export const getPost = factory.getOne (Post);
export const updatePost = factory.updateOne (Post);
export const deletePost = factory.deleteOne (Post);

export const getRelatedPosts = handle (async (req:Request, res:Response) : Promise<void> =>
{

});


const upload = multer ({
    storage: multer.memoryStorage (),
    fileFilter: factory.imageFilter
});

export const uploadImages = upload.array ('images', 100);

export const processImages = handle (async (req:Request, res:Response, next:() => void): Promise<void> =>
{
    const files = req.files as {[key:string]:Express.Multer.File[]};

    if (files.images)
    {
        req.body.images = files.images.map ((img, i) => `img-<SIZE>-${Date.now()}-${i}.jpeg`);

        await Promise.all (files.images.map (async (img, i) => {

            await sharp (img.buffer)
            .resize (75, 75)
            .toFormat ('jpeg')
            .jpeg ({quality: 100})
            .toFile (`/public/img/post/${req.body.images[i]}`.replace ('<SIZE>', 'small'));

            await sharp (img.buffer)
            .resize (200, 200)
            .toFormat ('jpeg')
            .jpeg ({quality: 100})
            .toFile (`/public/img/post/${req.body.images[i]}`.replace ('<SIZE>', 'medium'));

            await sharp (img.buffer)
            .resize (400, 400)
            .toFormat ('jpeg')
            .jpeg ({quality: 100})
            .toFile (`/public/img/post/${req.body.images[i]}`.replace ('<SIZE>', 'large'));
        }));
    }

    next ();
});