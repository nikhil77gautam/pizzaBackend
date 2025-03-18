import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Joi from "joi";
import sendEmail from "../../nodemailer.js";
import crypto from "crypto";
import customerauth from "../../Customer/Model/customerAuthModel.js";

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
  console.log("user data", req.body);

  const { error } = signupSchema.validate(req.body);
  if (error) {
    return res.json({ success: false, message: error.details[0].message });
  }

  try {
    const user = await customerauth.findOne({ email });
    if (user) {
      return res.json({ success: false, message: "Email already in use!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(12).toString("hex");

    await customerauth.create({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      verificationToken,
    });

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
      return res.json({
        success: true,
        data: "Account created, but email could not be sent",
      });
    }

    res.json({
      success: true,
      data: "Account created and verification email sent",
    });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

const verifyEmail = async (req, res) => {
  const { token } = req.query;

  try {
    const user = await customerauth.findOne({ verificationToken: token });

    if (!user) {
      return res.json({ success: false, message: "Invalid or expired token" });
    }

    user.verified = true;
    user.verificationToken = null;
    await user.save();

    res.json({ success: true, message: "Email successfully verified!" });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

const customerLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await customerauth.findOne({ email });
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

const customerLogout = async (req, res) => {
  try {
    res.json({ success: true, message: "Logout successful" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getUserInfo = async (req, res) => {
  try {
    const customerId = req.params.id;
    console.log("customerId", customerId);

    const customer = await customerauth.findById(customerId);
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
    const User = await customerauth.find();

    res.json({ success: true, message: User });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export {
  customerSignup,
  verifyEmail,
  customerLogin,
  getUserInfo,
  customerLogout,
  getAllUsers,
};
