import mongoose from 'mongoose'

// user schema
const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
}, { timestamps: true })

//exporting the user model
const User = mongoose.model('User', userSchema)
export default User