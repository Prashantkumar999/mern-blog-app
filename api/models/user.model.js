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
        default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYP-KKtRJXm9qK7k2_PA1utxbxWdpzGIdulQ&s"
    },
    isAdmin:{
        type:Boolean,
        default:false
    }

}, { timestamps: true })

//exporting the user model
const User = mongoose.model('User', userSchema)
export default User