import nodemailer from 'nodemailer';

// Create a transporter object using your email service
const transporter = nodemailer.createTransport({
    service: 'gmail', // Or any other email service
    auth: {
        user: "nagarsourabh337@gmail.com", // Use environment variables for security
        pass: "cjomfbdrfkszjxly",
    }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
    const mailOptions = {
        from: 'nagarsourabh337@gmail.com', // Sender address
        to: to, // Recipient address
        subject: subject, // Subject line
        text: text, // Plain text body
        html: html // HTML body
    };
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};

export default sendEmail;
