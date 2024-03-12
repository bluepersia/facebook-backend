import { HydratedDocument, Query, Schema, Types, model } from "mongoose";
import Post from "./postModel";
import Image from "./imageModel";

export interface IReaction 
{
    post: Types.ObjectId | undefined,
    image: Types.ObjectId | undefined,
    user: Types.ObjectId
}

export interface IReactable {
    likes: number
}

const reactionSchema = new Schema<IReaction> ({
    post: {
        type: Schema.ObjectId,
        ref: 'Post',
        validate: {
            validator: function (val:Types.ObjectId) : boolean
            {
                return Boolean (val || this.image);
            },
            message: 'Reaction must belong to an image or post'
        }
    },
    image: {
        type: Schema.ObjectId,
        ref: 'Image',
        validate: {
            validator: function (val:Types.ObjectId) : boolean
            {
                return Boolean (val || this.post);
            },
            message: 'Reaction must belong to an image or post'
        }
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User',
        required: [true, 'Reaction must belong to a user']
    }
})


reactionSchema.pre (/^find/, function(next):void
{
    (this as Query<unknown, unknown>).populate ({path: 'user', select: 'name imageProfile'})
    next ();
});

async function calcLikes (doc:HydratedDocument<IReaction>) : Promise<void>
{
    const stats = await Reaction.aggregate ([
        {
            $match: doc.post ? {post: doc.post} : {image: doc.image}
        },
        {
            $group: {
                _id: doc.post ? '$post' : '$image',
                likes: {$sum:1}
            }
        }
    ])


    const data = stats.length > 0 ? stats[0] : {likes: 0};

    if (doc.post)
        await Post.findByIdAndUpdate (doc.post, data);
    else
        await Image.findByIdAndUpdate (doc.image, data);
}

reactionSchema.post ('save', async function () : Promise<void>
{
    await calcLikes (this);
});

reactionSchema.post (/(findOneAndUpdate|findOneAndDelete)/, async function (doc) : Promise<void>
{
    await calcLikes (doc);
});

reactionSchema.index ({user:1, post:1, image:1}, {unique:true});

const Reaction = model ('Reaction', reactionSchema);

export default Reaction;