import { Query, Schema, Types, model } from "mongoose";


export interface IPost
{
    user: Types.ObjectId,
    text: string,
    images: Types.ObjectId[],
    createdAt:Date
}


const postSchema = new Schema<IPost> ({
    user: {
        type: Schema.ObjectId,
        ref: 'User',
        required: [true, 'Post must belong to a user']
    },
    text: {
        type:String,
        validate: {
            validator: function (val:string) : boolean
            {
                return Boolean (val || this.images.length > 0);
            },

            message: 'Post must contain either text or images'
        }
    },
    images: {   
        type: [{
            type: Schema.ObjectId,
            ref: 'Image'
        }],
        validate: {
            validator: function (val:Types.ObjectId[]) :boolean
            {
                return val.length > 0 || this.text;
            },
            message: 'Post must contain either text or images'
        }
    },
    createdAt: {
        type: Date,
        default: Date.now ()
    }
})

postSchema.pre (/^find/, function (next): void
{
    (this as Query<unknown, unknown>).populate ('images');
    next ();
});

const Post = model ('Post', postSchema);

export default Post;