import dns from "dns";
import express from "express";
import notesRoutes from "./Routes/notesRoutes.js";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import mongoose, { mongo } from "mongoose";

dotenv.config();

dns.setServers(["8.8.8.8"]);

const app = express();
const PORT=process.env.PORT || 5000
connectDB();

app.use(express.json());

app.use("/api/notes", notesRoutes);

app.listen(PORT, () => {
    console.log("Server is running on port 5000");
});