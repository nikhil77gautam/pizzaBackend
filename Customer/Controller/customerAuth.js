import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Joi from "joi";
import sendEmail from "../../nodemailer.js";
import crypto from "crypto";
import Customer from "../../Customer/Model/customerAuthModel.js";

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
  const { email, password, name, phoneNumber } = req.body;
  console.log("Received user data:", req.body);

  const { error } = signupSchema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  }

  try {
    const userExists = await Customer.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ success: false, message: "Email already in use!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(12).toString("hex");

    console.log("Generated Token:", verificationToken); // Debugging

    const newUser = new Customer({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      verificationToken,
      verified: false,
    });
    await newUser.save();
    console.log("New User Created:", newUser); // Debugging

    const verificationLink = `https://pizzabackend-0x3r.onrender.com/customerverify-email?token=${verificationToken}`;
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
      console.log("Email sending failed for:", email);
      return res.json({
        success: true,
        message: "Account created, but email could not be sent",
      });
    }

    res.json({
      success: true,
      message: "Account created and verification email sent",
    });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const verifyEmail = async (req, res) => {
  const { token } = req.query;
  console.log("Received verification token:", token); // Debugging

  if (!token) {
    return res
      .status(400)
      .json({ success: false, message: "Token is required" });
  }

  try {
    const user = await Customer.findOne({ verificationToken: token });

    if (!user) {
      console.log("Invalid or expired token for verification.");
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });
    }

    console.log("User found:", user._id); // Debugging

    user.verified = true;
    user.verificationToken = null; // Clear the token
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Email successfully verified!" });
  } catch (err) {
    console.error("Verification Error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const customerLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Customer.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "Email not found" });
    }

    if (!user.verified) {
      return res.json({ success: false, message: "Email not verified" });
    }

    const result = await bcrypt.compare(password, user.password);

    if (result) {
      const token = jwt.sign({ name: user.name, _id: user._id }, "abcd");
      const _id = user._id;
      res.json({ success: true, message: "Login successful", token, _id });
    } else {
      res.json({ success: false, message: "Incorrect password" });
    }
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

const getUserInfo = async (req, res) => {
  try {
    const customerId = req.params.id;
    console.log("customerId", customerId);

    const customer = await Customer.findById(customerId);
    console.log("customer", customer);

    if (!customer) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({ success: true, data: customer });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await Customer.find();
    res.json({ success: true, message: users });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export { customerSignup, verifyEmail, customerLogin, getUserInfo, getAllUsers };
