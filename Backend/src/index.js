import dns from "dns";
import express from "express";
import notesRoutes from "./Routes/notesRoutes.js";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import mongoose from "mongoose";
import rateLimiter from '../middleware/rateLimiter.js'
import cors from "cors";

dotenv.config();

dns.setServers(["8.8.8.8"]);

const app = express();
const PORT=process.env.PORT || 5000
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use(rateLimiter)
app.use("/api/notes", notesRoutes);

connectDB().then(()=>{app.listen(PORT, () => {
    console.log("Server is running on port 5000");
});})
