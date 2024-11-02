import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return next(errorHandler(400, "All fields are required"));
    }

    try {
        const hashedPassword = bcryptjs.hashSync(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        res.json({ message: "User created successfully!" });
    } catch (error) {
        next(error);
    }
};

export const signin = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(errorHandler(400, "All fields are required"));
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return next(errorHandler(404, "User not found"));
        }

        const isPasswordValid = bcryptjs.compareSync(password, user.password);
        if (!isPasswordValid) {
            return next(errorHandler(400, "Invalid password"));
        }

        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY);
        res.status(200)
            .cookie('access_token', token, { httpOnly: true })
            .json({
                validUser: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                }
            });

    } catch (error) {
        next(error);
    }
};

export const google = async (req, res, next) => {
    const { email, name, gmailPhotoUrl } = req.body;

    try {
        const user = await User.findOne({ email });
        let token;

        if (user) {
            token = jwt.sign({ id: user._id }, process.env.SECRET_KEY);
            const { password, ...userData } = user._doc;

            res.status(200)
                .cookie('access_token', token, { httpOnly: true })
                .json(userData);
        } else {
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

            const newUser = new User({
                username: name.toLowerCase().split(' ').join('') + Math.random().toString(10).slice(-4),
                email,
                password: hashedPassword,
                profilePicture: gmailPhotoUrl,
            });

            await newUser.save();

            token = jwt.sign({ id: newUser._id }, process.env.SECRET_KEY);
            const { password, ...userData } = newUser._doc;

            res.status(200)
                .cookie('access_token', token, { httpOnly: true })
                .json(userData);
        }
    } catch (error) {
        next(error);
    }
};
