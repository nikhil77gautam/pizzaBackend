import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Joi from "joi";
import sendEmail from "../../nodemailer.js";
import crypto from "crypto";
import customerauth from "../../Customer/Model/customerAuthModel.js";
import dotenv from "dotenv";

dotenv.config();

const signupSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().min(3).required(),
  phoneNumber: Joi.string().min(10).required(),
  address: Joi.object({
    city: Joi.string().optional(),
    state: Joi.string().optional(),
    country: Joi.string().optional(),
    postalCode: Joi.string().min(6).optional(),
  }).optional(),
});

const customerSignup = async (req, res) => {
  try {
    const { email, password, name, phoneNumber } = req.body;
    console.log("User data:", req.body);

    const { error } = signupSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    const existingUser = await customerauth.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already in use!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(16).toString("hex");

    const newUser = new customerauth({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      verificationToken,
      verified: false,
    });
    await newUser.save();

    const verificationLink = `http://localhost:8000/customerverify-email?token=${verificationToken}`;
    const emailContent = `Hi ${name},<br/><br/>
            Please click the following link to verify your email: 
            <a href="${verificationLink}">Verify Email</a><br/><br/>
            Thank you!`;

    const emailSent = await sendEmail(
      email,
      "Email Verification",
      "",
      emailContent
    );
    if (!emailSent) {
      return res.status(500).json({
        success: false,
        message: "Account created, but email could not be sent.",
      });
    }

    res.status(201).json({
      success: true,
      message: "Account created and verification email sent.",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res
        .status(400)
        .json({ success: false, message: "No token provided" });
    }

    const user = await customerauth.findOne({ verificationToken: token });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });
    }

    user.verified = true;
    user.verificationToken = null;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Email successfully verified!" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const customerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await customerauth.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Email not found" });
    }

    if (!user.verified) {
      return res
        .status(400)
        .json({ success: false, message: "Email not verified" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect password" });
    }

    const token = jwt.sign(
      { _id: user._id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      _id: user._id,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getUserInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await customerauth.findById(id);

    if (!customer) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: customer });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await customerauth.find();
    res.status(200).json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export { customerSignup, verifyEmail, customerLogin, getUserInfo, getAllUsers };
