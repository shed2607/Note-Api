const UserModel = require("../model/userModel");
//Middleware to handle asynchronous routes
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const createToken = require("../middleware/createJwtToken");

const register = asyncHandler(async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      res.status(403);
      throw new Error("All fields are required");
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      res.status(400);
      throw new Error("Please enter a valid email!");
    }

    const existingEmail = await UserModel.findOne({ email: email });
    const existingUsername = await UserModel.findOne({ username: username });
    if (existingEmail) {
      res.status(400);
      throw new Error("Email is already in use");
    } else if (existingUsername) {
      res.status(400);
      throw new Error("Username is already in use");
    }

    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userId = username + ":" + email.split("@")[0];

    const user = await UserModel.create({
      userId: userId,
      username: username,
      email: email,
      password: hashedPassword,
    });
    res.status(200).json(user);
  } catch (error) {
    // Handle errors
    res.status(500).json({ error: error.message });
  }
});

const login = asyncHandler(async (req, res) => {
  try {
    const { username, email, password } = req.body;
    let user;

    if (!username && !email) {
      res.status(401);
      throw new Error("Enter username or email address");
    } else if (!password) {
      res.status(401);
      throw new Error("Enter password");
    } else if (username && email) {
      res.status(401);
      throw new Error("For real?, username or password");
    }

    const byEmail = await UserModel.findOne({ email });
    const byUsername = await UserModel.findOne({ username });

    if (byEmail) {
      user = byEmail;
    } else if (byUsername) {
      user = byUsername;
    } else {
      res.status(404);
      throw new Error("user not found");
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400);
      throw new Error("Invalid credentials!");
    }

    const token = createToken(user);

    res.status(200).json({
      user: user._id,
      token: token,
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({ error: error.message });
  }
});

module.exports = {
  register,
  login,
};
