import { Schema, Types, model } from "mongoose";


export interface IPost
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
    }
})


const Post = model ('Post', postSchema);

export default Post;