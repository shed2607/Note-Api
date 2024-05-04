const router = require("express").Router();
const {
  createNote,
  getAllNote,
  getNoteById,
  findByItem,
  getUserNotes,
  updateNote,
} = require("../controllers/noteController");
const validatingToken = require("../middleware/validatingToken");

router.post("/create", validatingToken, createNote);
router.get("/all", getAllNote);
router.get("/note/:id", validatingToken, getNoteById);
router.get("/search/:item", validatingToken, findByItem);
router.get("/usernotes", validatingToken, getUserNotes);
router.put("/update/:id", validatingToken, updateNote);

module.exports = router;
