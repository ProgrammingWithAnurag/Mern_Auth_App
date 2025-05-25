import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import colors from 'colors';    
import connectDB from './db/index.js';
import userRoutes from './routes/User.routes.js';

const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;
connectDB();

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const corsOption = {
      origin: 'http://localhost:3000',
      credentials: true
}
app.use(cors(corsOption))
//Routes
app.use('/api/v1/user',userRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`.bgCyan.white);
});