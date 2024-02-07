import mongoose from 'mongoose'
const { Schema } = mongoose

const postSchema = new Schema({
    title: {
        type: String,
        required: [true, "please add a title"]
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Author'
    },
    views: {
        type: Number,
        default: 0
    },
    reviews: {
        type: Number,
        default: 0
    }
},
    {
        timestamps: true
    }
)

const Post = mongoose.model("Post", postSchema)

export default Post