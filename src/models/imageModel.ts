import { Types } from "mongoose";
import { Schema, model } from "mongoose";
import { IReactable } from "./reactionModel";


export interface IImage extends IReactable
{
    post: Types.ObjectId | undefined,
    album: Types.ObjectId | undefined,
    url: string,
    createdAt:Date
}


const imageSchema = new Schema<IImage> ({
    post: {
        type: Schema.ObjectId,
        ref: 'Post',
        validate: {
            validator: function (val:Types.ObjectId)
            {
                return val || this.album;
            },
            message: 'Image must belong to a post or an album'
        }
    },
    album: {
        type:Schema.ObjectId,
        ref: 'Album',
        validate: {
            validator: function (val:Types.ObjectId)
            {
                return val || this.post;
            },
            message: 'Image must belong to a post or an albu'
        }
    },
    url:{
        type:String,
        required:true
    },
    createdAt: {
        type:Date,
        default:Date.now ()
    },
    likes: {
        type:Number,
        default: 0
    }
})


const Image = model ('Image', imageSchema);


export default Image;