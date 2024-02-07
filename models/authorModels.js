import mongoose from 'mongoose'
const { Schema } = mongoose

const authorSchema = new Schema({
    firstName: {
        type: String,
        required: [true, "please add a first name"]
    },
    lastName: {
        type: String,
        required: [true, "please add a last name"]
    },
    posts: {
        type: Number,
        default: 0
    }
},
    {
        timestamps: true
    }
)

const Author = mongoose.model("Author", authorSchema)

export default Author