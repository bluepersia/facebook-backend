import { Schema, Types, model } from "mongoose";


export interface IComment
{
    post: Types.ObjectId,
    image: Types.ObjectId,
    comment:Types.ObjectId,
    text: string,
    level:number
}


const commentSchema = new Schema<IComment> ({
    post: {
        type: Schema.ObjectId,
        ref: 'Post'
    },
    image: {
        type: Schema.ObjectId,
        ref: 'Image'
    },
    comment: {
        type: Schema.ObjectId,
        ref: 'Comment'
    }
})


const Comment = model ('Comment', commentSchema);


export default Comment;