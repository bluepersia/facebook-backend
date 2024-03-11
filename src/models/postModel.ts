import { Query, Schema, Types, model } from "mongoose";
import { IReactable } from "./reactionModel";


export interface IPost extends IReactable
{
    user: Types.ObjectId,
    text: string,
    createdAt:Date
}


const postSchema = new Schema<IPost> ({
    user: {
        type: Schema.ObjectId,
        ref: 'User',
        required: [true, 'Post must belong to a user']
    },
    text: String,
    createdAt: {
        type: Date,
        default: Date.now ()
    },
    likes: {
        type: Number,
        default: 0
    }
})

postSchema.virtual ('images', {
    ref: 'Image',
    foreignField: 'post',
    localField: '_id'
})

postSchema.pre (/^find/, function (next): void
{
    (this as Query<unknown, unknown>).populate ('images');
    next ();
});

const Post = model ('Post', postSchema);

export default Post;