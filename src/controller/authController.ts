import { Request, Response } from "express";
import User, { IUser } from "../models/userModel";
import handle from 'express-async-handler';
import jwt from 'jsonwebtoken';
import { HydratedDocument } from "mongoose";

function signJWT (id:string) : string
{
    return jwt.sign ({id}, process.env.JWT_SECRET!, {expiresIn: process.env.JWT_EXPIRES_IN})
}

function signSendJWT (user:HydratedDocument<IUser>, res:Response, statusCode = 200) : void
{
    const token = signJWT (user.id);

    res.cookie ('jwt', token, {
        expires: new Date (Date.now() + (Number(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000)),
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true
    });

    user.password = undefined;
    user.passwordConfirm = undefined;

    res.status (statusCode).json ({
        status: 'success',
        token,
        data: {
            user
        }
    })
}


export const signup = handle (async (req:Request, res:Response) : Promise<void> =>
{
    const { firstName, lastName, email, password, passwordConfirm} = req.body;

    const user = await User.create ({firstName, lastName, email, password, passwordConfirm});

    signSendJWT (user, res, 201);
});