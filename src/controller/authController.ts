import { Request, Response } from "express";
import User, { IUser } from "../models/userModel";
import handle from 'express-async-handler';
import jwt from 'jsonwebtoken';
import { HydratedDocument } from "mongoose";
import AppError from "../util/AppError";
const util = require ('util');

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


export const login = handle (async (req:Request, res:Response) : Promise<void> =>
{
    const {email, password} = req.body;

    if (!email || !password)
        throw new AppError ('Please provide email and password', 400);

    const user = await User.findOne ({email}).select ('+password');

    if (!user)
        throw new AppError ('No user with that email', 404);

    if (!(await user.comparePasswords (password, user.password!)))
        throw new AppError ('Incorrect password', 401);

    signSendJWT (user, res, 200);
});


export interface IRequest extends Request {
    user: HydratedDocument<IUser>
}

export const protect = handle (async(req:Request, res:Response, next:() => void) : Promise<void> =>
{
    let token;
    if (req.headers.authorization?.startsWith ('Bearer'))
        token = req.headers.authorization.split (' ')[1];
    else
        token = req.cookies.jwt;

    if (!token)
        throw new AppError ('You are not logged in', 401);

    const decoded = await util.promisify (jwt.verify)(token, process.env.JWT_SECRET);

    const user = await User.findById (decoded.id);

    if (!user)
        throw new AppError ('This user no longer exists. Please log in again.', 401);

    if (user.hasPasswordChangedSince (new Date (decoded.iat * 1000)))
        throw new AppError ('Password has changed since last login. Please re-log in.', 401);

    (this as IRequest).user = user;
    next ();
});