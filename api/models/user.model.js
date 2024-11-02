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
    profilePicture:{
        type:String,
        default:"https://www.google.com/url?sa=i&url=https%3A%2F%2Fpixabay.com%2Fvectors%2Fblank-profile-picture-mystery-man-973460%2F&psig=AOvVaw13toP8U7panmCCFCJYiSUS&ust=1730616873952000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCPDqp9iIvYkDFQAAAAAdAAAAABAE"
    }

}, { timestamps: true })

//exporting the user model
const User = mongoose.model('User', userSchema)
export default User