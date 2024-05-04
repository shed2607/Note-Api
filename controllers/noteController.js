const NoteModel = require("../model/notesModel");
//Middleware to handle asynchronous routes
const asyncHandler = require("express-async-handler");
const calculateTimeDifference = require("../middleware/calculateTimeDifference");

//create a new note
const createNote = asyncHandler(async (req, res) => {
  try {
    const { title, desc } = req.body;
    const { userId } = req.user;
    if (!title || !desc) {
      res.status(400);
      throw new Error("All fields are required");
    }

    const noteTitle = await NoteModel.findOne({
      $and: [{ title: title, userId: userId }],
    });

    if (noteTitle) {
      res.status(400);
      throw new Error("Note with similar title already available");
    }

    const note = await NoteModel.create({
      title: title,
      desc: desc,
      userId: userId,
    });
    res.status(200).json(note);
  } catch (error) {
    // Handle errors
    res.status(500).json({ error: error.message });
  }
});

const getUserNotes = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.user;
    if (!userId) {
      res.status(400);
      throw new Error("");
    }

    let notes = await NoteModel.find({ userId: userId });
    notes = notes.map((note) => ({
      ...note.toObject(), // Convert Mongoose object to plain JavaScript object
      timeDifference: calculateTimeDifference(note.date),
    }));

    res.status(200).json(notes);
  } catch (error) {
    // Handle errors
    res.status(500).json({ error: error.message });
  }
});

const getAllNote = asyncHandler(async (req, res) => {
  try {
    let notes = await NoteModel.find({}); // Calculate time difference for each note
    notes = notes.map((note) => ({
      ...note.toObject(), // Convert Mongoose object to plain JavaScript object
      timeDifference: calculateTimeDifference(note.date),
    }));

    res.status(200).json(notes);
  } catch (error) {
    // Handle errors
    res.status(500).json({ error: error.message });
  }
});

const getNoteById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;
    const note = await NoteModel.findOne({ _id: id });
    if (!note) {
      res.status(404);
      throw new Error("Note not found");
    }

    if (note.userId != userId) {
      return res.status(400).json({ error: "Not authorized" });
    }

    const time = calculateTimeDifference(note.date);
    const noteWithTime = {
      ...note.toObject(), // Convert Mongoose object to plain JavaScript object
      timeDifference: time,
    };
    //console.log(note.title);
    res.status(200).json(noteWithTime);
    //res.status(200).json(note);
  } catch (error) {
    // Handle errors
    res.status(500).json({ error: error.message });
  }
});

const findByItem = asyncHandler(async (req, res) => {
  try {
    const { item } = req.params;
    const notes = await NoteModel.find({
      $or: [
        { title: { $regex: item, $options: "i" } }, // Case-insensitive regex match for title
        { desc: { $regex: item, $options: "i" } }, // Case-insensitive regex match for desc
      ],
    });

    if (notes.length == 0) {
      res.status(404);
      throw new Error("Note not found");
    }

    const modifiedNotes = notes.map((note) => ({
      ...note.toObject(),
      timeDifference: calculateTimeDifference(note.date),
    }));

    res.status(200).json(modifiedNotes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const updateNote = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;
    const { title, desc } = req.body;
    const note = await NoteModel.findOne({ _id: id });

    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }
    if (note.userId != userId) {
      return res.status(400).json({ error: "Not authorized" });
    }

    if (!title || !desc) {
      return res
        .status(400)
        .json({ error: "Title and description are required" });
    }

    // Update the note with new title, description, and updated date
    note.title = title;
    note.desc = desc;
    note.date = new Date(); // Set updated date to current date and time
    await note.save();

    res.status(200).json({ note: note });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = {
  createNote,
  getAllNote,
  getNoteById,
  findByItem,
  getUserNotes,
  updateNote,
};
