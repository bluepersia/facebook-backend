import { Schema, model } from "mongoose";
import validator from 'validator';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export interface IUser
{
    firstName:string,
    lastName:string,
    email:string,
    role:string,
    imageProfile:string,
    imageCover:string,
    password:string | undefined,
    passwordConfirm: string | undefined,
    passwordChangedAt:Date,
    passwordResetToken:string | undefined,
    passwordResetExpires: Date | undefined,
    active: boolean,
    comparePasswords: (s:string, hash:string) => Promise<boolean>,
    hasPasswordChangedSince: (date:Date) => boolean,
    genPasswordResetToken: () => string
}


const userSchema = new Schema<IUser>({
    firstName: {
        type:String,
        required: [true, 'Please provide your first name'],
        minlength:2,
        validate: [validator.isAlpha, 'First name must only contain a-z or A-Z characters']
    },
    lastName: {
        type:String,
        required: [true, 'Please provide your last name'],
        minlength: 2,
        validate: [validator.isAlpha, 'Last name must only contain a-z or A-Z characters']
    },
    email: {
        type:String,
        required: [true, 'Please provide your email address'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email address']
    },
    role: {
        type:String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    imageProfile: String,
    imageCover: String,
    password: {
        type: String,
        minlength: 8,
        required: [true, 'Please provide a password'],
        select: false
    },
    passwordConfirm: {
        type:String,
        required: [true, 'Please confirm your password'],
        validate: {
            validator: function (val:string) : boolean
            {
                return val === this.password;
            },
            message: 'Passwords must match!'
        }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true
    }
})

userSchema.pre ('save', async function (next) : Promise<void>
{
    if (this.isModified ('password'))
    {
        this.password = await bcrypt.hash (this.password!, 12);

        if (!this.isNew)
            this.passwordChangedAt = new Date (Date.now() - 1000);
    }

    this.passwordConfirm = undefined;
    next ();
});


userSchema.methods.comparePasswords = async function (s:string, hash:string) : Promise<boolean>
{
    return await bcrypt.compare (s, hash);
}

userSchema.methods.hasPasswordChangedSince = function (date:Date) : boolean
{
    return this.passwordChangedAt && this.passwordChangedAt >= date;
}

userSchema.methods.genPasswordResetToken = function () : string
{
    const token = crypto.randomBytes (32).toString ('hex');

    this.passwordResetToken = crypto.createHash ('sha256').update (token).digest ('hex');
    this.passwordResetExpires = new Date(Date.now() + (7 * 24 * 60 * 60 * 1000));

    return token;
}

const User = model ('User', userSchema);


export default User;