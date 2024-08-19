
import express from "express"
import dotenv from "dotenv"
import cors from 'cors'
import connectDB from "./config/db.js";
import user from './routes/user.js'
dotenv.config();
connectDB();
const app = express();
app.use(express.json());

//cors 
const allowedOrigins = [
    origin: 'https://unishare-q3pz.vercel.app',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
    
  ];
  
  app.use(cors({
    origin: function (origin, callback) {
      // Allow requests with no origin 
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  }));

  //Routes

app.use('/api/v1/auth',user);


// Set up the server to listen on a specified port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

