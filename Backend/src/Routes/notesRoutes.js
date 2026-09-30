import express from "express";

import {
    getAllNotes,
    createNote,
    editNote,
    deleteNote
} from "../controllers/notesControllers.js";

const notesRoutes = express.Router();

notesRoutes.get("/", getAllNotes);
notesRoutes.post("/", createNote);
notesRoutes.put("/:id", editNote);
notesRoutes.delete("/:id", deleteNote);

export default notesRoutes;