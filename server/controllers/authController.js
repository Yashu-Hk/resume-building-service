const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register a new user
exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if the user already exists
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create a new user
    user = new User({
      username,
      email,
      password,
    });

    // Encrypt the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save the user to the database
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if the password is correct
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    await user.save();

    res.status(201).json({ message: "User login successfully" });

    // Create JWT token
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (error, token) => {
        if (error) {
          console.error("Error creating JWT token:", error);
          return res.status(500).json({ message: "Server Error" });
        }
        res.json({ token });
      }
    );
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


// Get current user information
exports.getCurrentUser = async (req, res) => {
    try {
        // Check if req.user is defined and has the id property
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'User authentication failed' });
        }

        // Assuming you have a mechanism to identify the current user (e.g., JWT middleware)
        const userId = req.user.id; // Get the user ID from the request

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user); // Send the user information
    } catch (error) {
        console.error('Error fetching current user:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};



// User profile route
exports.getUserProfile = async (req, res) => {
  try {
    // Fetch user data from the database
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Render the user profile page with user data
    res.render("profile", { user });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Dashboard route
exports.getUserFiles = async (req, res) => {
  try {
    // Fetch files created by the logged-in user from the database
    const files = await File.find({ createdBy: req.user.id });
    res.json(files);
  } catch (error) {
    console.error("Error fetching user files:", error);
    res.status(500).json({ message: "Server Error" });
  }
};