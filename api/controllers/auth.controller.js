import User from '../models/user.model.js'
import bcryptjs from 'bcryptjs'
import { errorHandler } from '../utils/error.js'
import Jwt from 'jsonwebtoken'
export const signup = async (req, res, next) => {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
        next(errorHandler(400, "all fields are required"))
    }
    const hashedPass = bcryptjs.hashSync(password, 10)
    try {
        const newUser = new User({ username, email, password: hashedPass })
        await newUser.save()

        res.json({
            message: "User created successfully!"
        })
    }
    catch (error) {
        next(error)
    }
}

export const signin = async (req, res, next) => {
    console.log("enterred in signin")
    const { email, password } = req.body;

    if (!email || !password) {
        next(errorHandler(400, "All fields are required"))
    }
    try {
        const validUser = await User.findOne({ email })
        if (!validUser) {
           return next(errorHandler(404, "User not found"));
        }
        const validPassword = bcryptjs.compareSync(password, validUser.password) // we are using bcrypt compairSync to validate the password ,,becasue password is encrypted and the just cant compair 
        if (!validPassword) {
            return next(errorHandler(400, "please enter the valid password"))
        }
        // creating a token for auth
        const token = Jwt.sign(
            { id: validUser._id },
            process.env.SECRET_KEY,
        );
        res.status(200).cookie('access_token', token, {
            httpOnly: true,
        }).json({
            validUser:{
                _id:validUser._id,
                username: validUser.username,
                email:validUser.email,
            }
        })

    }
    catch (error) {
        next(error);
    }
}