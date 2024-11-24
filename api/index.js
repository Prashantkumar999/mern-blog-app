import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRoutes from './routes/user.route.js'
import authRouters from './routes/auth.route.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'

dotenv.config()

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Database connection successful!")
  })
  .catch((err) => {
    console.log("Database connection error:", err)
  })

const app = express()

// CORS setup (adjust origin for production)
app.use(cors({
  origin: '*', // Adjust based on your frontend URL in production
  credentials: true, // Allows sending cookies
}))

// Middleware
app.use(cookieParser()) // Move this above routes
app.use(express.json())

// Routes
app.use('/api/user', userRoutes)
app.use('/api/auth', authRouters)

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
