import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
import connectDB from "./config/db.js";
import user from './routes/user.js';

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// CORS Configuration
const allowedOrigins = [
    
    'https://unishare-q3pz.vercel.app', // Including the origin you want to allow
];

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, curl requests)
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow cookies and authentication headers
    optionsSuccessStatus: 204 // To handle successful preflight requests
};

app.use(cors(corsOptions)); // Use the defined corsOptions

// Routes
app.use('/api/v1/auth', user);

// Set up the server to listen on a specified port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
