import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRoutes from './routes/user.route.js'
import authRouters from './routes/auth.route.js'
import commentRoute from './routes/comment.route.js'
// import cors from 'cors'
import cookieParser from 'cookie-parser'
import postRoutes from './routes/post.route.js'
import path from 'path'

dotenv.config()

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Database connection successful!")
  })
  .catch((err) => {
    console.log("Database connection error:", err)
  })
const __dirname = path.resolve();
const app = express()



// Middleware
app.use(cookieParser()) 
app.use(express.json())

// Routes
app.use('/api/user', userRoutes)
app.use('/api/auth', authRouters)
app.use('/api/post',postRoutes)
app.use('/api/comment',commentRoute)

app.use(express.static(path.join(__dirname,'/client/dist')));
app.get('*',(req,res)=>{
  res.sendFile(path.join(__dirname,'client','dist','index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500
  const message = err.message || "Internal server error"
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  })
})

// Set server port dynamically (for cloud hosting compatibility)
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}!`)
})
