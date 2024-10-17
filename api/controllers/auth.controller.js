import User from '../models/user.model.js'
import bcryptjs from 'bcryptjs'
import { errorHandler } from '../utils/error.js'
export const signup = async (req, res, next) => {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
      next(errorHandler(400,"all fields are required"))
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