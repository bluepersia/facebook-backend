import { Query, Schema, Types, model } from "mongoose";


export interface IComment
{
    user: Types.ObjectId,
    post: Types.ObjectId,
    image: Types.ObjectId,
    comment:Types.ObjectId,
    text: string,
    level:number,
    type:string
}


const commentSchema = new Schema<IComment> ({
    user: {
        type:Schema.ObjectId,
        ref: 'User',
        required: [true, 'Comment must belong to a user']
    },
    post: {
        type: Schema.ObjectId,
        ref: 'Post',
        validate: {
            validator: function (val:Types.ObjectId):boolean
            {
                return Boolean(val || this.image || this.comment);
            },
            message: 'Comment must belong to a post, image or comment'
        }
    },
    image: {
        type: Schema.ObjectId,
        ref: 'Image',
        validate: {
            validator: function (val:Types.ObjectId):boolean
            {
                return Boolean(val || this.post || this.comment);
            },
            message: 'Comment must belong to a post, image or comment'
        }
    },
    comment: {
        type: Schema.ObjectId,
        ref: 'Comment',
        validate: {
            validator: function (val:Types.ObjectId):boolean
            {
                return Boolean(val || this.image || this.post);
            },
            message: 'Comment must belong to a post, image or comment'
        }
    },
    text: {
        type: String,
        required:[true, 'A comment must have text!'],
        minlength: 2
    },
    level: {
        type:Number,
        default: 0
    },
    type: {
        type:String,
        default:'comment'
    }
})

commentSchema.pre ('save', async function(next) : Promise<void>
{
    await this.populate ({path: 'user', select: 'firstName lastName imageProfile'})
    next ();
});

commentSchema.pre (/^find/, function (next): void
{
    (this as Query<unknown,unknown>).populate ({
        path: 'user',
        select: 'firstName lastName imageProfile'
    })
    next ();
});

const Comment = model ('Comment', commentSchema);


export default Comment;