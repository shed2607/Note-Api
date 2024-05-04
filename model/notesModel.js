const mongoose = require("mongoose");

const noteSchema = mongoose.Schema({
  title: {
    type: "string",
  },
  desc: {
    type: "string",
  },
  date: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: "string",
  },
});

module.exports = mongoose.model("Note", noteSchema);
