import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

mongoose.connect(process.env.MONGODB_URL)
.then(()=>{
    console.log("database connection successfull!")
})
.catch((err)=>{
    console.log("err",err)
})
const app = express()

app.listen(3000,()=>{
    console.log("Server is running on port 3000!")
})
 