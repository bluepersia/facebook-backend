import { Schema, Types, model } from "mongoose";

export interface IFriendship
{
    a: Types.ObjectId,
    b: Types.ObjectId
}


const friendshipSchema = new Schema<IFriendship> ({
    a: {
        type:Schema.ObjectId,
        ref: 'User',
        required: [true, 'Friendship must have person A']
    },
    b: {
        type: Schema.ObjectId,
        ref: 'User',
        required: [true, 'Friendship must have person B']
    }
})


const Friendship = model ('Friendship', friendshipSchema);


export default Friendship;