import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRoutes from './routes/user.route.js'
import authRouters from './routes/auth.route.js'
dotenv.config()



mongoose.connect(process.env.MONGODB_URL)
.then(()=>{
    console.log("database connection successfull!")
})
.catch((err)=>{
    console.log("err",err)
})
const app = express()
app.use(express.json());
app.listen(3000,()=>{
    console.log("Server is running on port 3000!")
})
 
app.use('/api/user',userRoutes)
app.use('/api/auth',authRouters)

