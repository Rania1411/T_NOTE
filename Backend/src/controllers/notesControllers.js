import Note from "../models/Note.js";
export async function getAllNotes(req, res) {
    try {
        const notes = await Note.find().sort({ createdAt: -1 })
        res.status(200).json(notes);
    } catch (error) {
        console.error(" error in getting all notes controller", error)
        res.status(500).json({ message: "internal server error" });
    }

};

export async function getNoteById(req, res) {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) return res.status(404).json({ message: "note not found" });
        return res.status(200).json(note);
    } catch (error) {
        console.error("error in getNoteById controller", error);
        return res.status(500).json({ message: "internal server error" });
    }
}

export async function createNote(req, res) {
    try {
        const { title, content } = req.body
        const newnote = new Note({ title, content });
        await newnote.save()
        res.status(201).json({
            note: newnote,
            message: "note created succefully"
        });

    } catch (error) {
        console.error(" error in the creating controller", error)
        res.status(500).json({ message: "internal server error" })
    }

};


export async function editNote(req, res) {
    try {


        const { title, content } = req.body;
        const upadtedNote = await Note.findByIdAndUpdate(
            req.params.id,
            {
                title,
                content
            },
            { new: true }
        );

        console.log("note:", upadtedNote);

        if (!upadtedNote) {
            return res.status(404).json({
                message: "note not found"
            });
        }

        return res.status(200).json(upadtedNote);

    } catch (error) {
        console.error("ERROR:", error);

        return res.status(500).json({
            message: "internal server error"
        });
    }
}

export async function deleteNote(req, res) {
    try {

        const note = await Note.findByIdAndDelete(
            req.params.id
        )
        if (!note) {
            return res.status(404).json({ message: "note not found" });
        }
        return res.status(200).json({
            deletedNote: note,
            message: "note deletd succefully"
        })


    } catch (error) {
        console.error(" error in the deleting controller", error)
        res.status(500).json({ message: "internal server error" })
    }


};