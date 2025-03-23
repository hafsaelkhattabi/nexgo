const express = require("express");
const multer = require("multer");
const path = require("path");
const nodemailer = require("nodemailer")


const router = express.Router();

// Configure Multer for file uploads 
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Make sure you have the 'uploads' folder in the root directory
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // Saving the file with a timestamp to avoid name collisions
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail", 
  auth: {
    user: process.env.EMAIL_USER, // I will put my email
    pass: process.env.EMAIL_PASSWORD, // i will put my email password
  },
});


// Submit application route with file upload
router.post("/", upload.single("resume"), async (req, res) => {
  try {
    // Extracting data from the request body and file
    const { name, email, phone } = req.body;
    const resumePath = req.file ? req.file.path : null; // Path of the uploaded file

    // Validate form data
    if (!name || !email || !phone || !resumePath) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Send email with form data
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender email
      to: process.env.EMAIL_USER, // Your email address
      subject: "New Delivery Application",
      html: `
        <h1>New Delivery Application</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
      `,
      attachments: [
        {
          filename: req.file.originalname,
          path: resumePath, // Attach the uploaded file
        },
      ],
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Send a success response
    res.status(201).json({
      message: "Application submitted successfully!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error submitting application",
      error: error.message,
    });
  }
});

module.exports = router;