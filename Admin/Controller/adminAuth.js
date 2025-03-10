import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Joi from "joi";
import sendEmail from '../../nodemailer.js';
import crypto from 'crypto';
import adminauth from "../../Admin/Model/authModel.js"

const signupSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().min(3).required()
});

const adminSignup = async (req, res) => {
    const { email, password, name } = req.body;

    const { error } = signupSchema.validate(req.body);
    if (error) {
        return res.json({ success: false, message: error.details[0].message });
    }

    try {
        const user = await adminauth.findOne({ email });
        if (user) {
            return res.json({ success: false, message: "Email already in use!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = crypto.randomBytes(12).toString('hex');

        await adminauth.create({ name, email, password: hashedPassword,verificationToken });//verificationToken });//

        const verificationLink =`http://localhost:8000/adminverifyEmail?token=${verificationToken}`;
        const emailContent = `
            Hi ${name},<br/><br/>
            Please verify your email by clicking on the following link: 
            <a href="${verificationLink}">Verify Email</a><br/><br/>
            Thank you!
        `;

        const emailSent = await sendEmail(email, "Email Verification", "", emailContent);

        if (!emailSent) {
            return res.json({ success: true, data: "Account created, but email could not be sent" });
        }

        res.json({ success: true, data: "Account created and verification email sent" });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
};

const adminverifyEmail = async (req, res) => {
    const { token } = req.query;

    try {
        const user = await adminauth.findOne({ verificationToken: token });

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

const adminlogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await adminauth.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "Email not found" });
        }

        if (!user.verified) {
            return res.json({ success: false, message: "Email not verified" });
        }

        const result = await bcrypt.compare(password, user.password);
        if (result) {
            const token = jwt.sign({ name: user.name, _id: user._id }, "abcd");
            res.json({ success: true, message: "Logged in", token });
        } else {
            res.json({ success: false, message: "Wrong password" });
        }
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
};




export {
    adminSignup,
    adminverifyEmail,
    adminlogin,
    
};
