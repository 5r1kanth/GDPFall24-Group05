const nodemailer = require("nodemailer");
const dotenv = require("dotenv").config();

const sendPasswordResetLink = async (mail, resetLink) => {
    try {
        const passwordMsg = {
            from: "onlinelearningproject2@gmail.com",
            to: mail,
            subject: `Reset Your Password`,
            html: `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #007bff;">Reset Your Password</h2>
      <p>Hi,</p>
      <p>We received a request to reset your password for your <strong>Online Learning</strong> account. If you made this request, simply click the button below to reset your password:</p>
      <div style="text-align: center; margin: 20px 0;">
        <a href="${resetLink}" style="background-color: #007bff; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-size: 16px;">Reset Password</a>
      </div>
      <p>If the button above doesn't work, copy and paste the following link into your browser:</p>
      <p><a href="${resetLink}" style="color: #007bff;">${resetLink}</a></p>
      <p>This link will expire in <strong>30 minutes</strong> for your security. If you did not request a password reset, please ignore this email or contact our support team.</p>
      <p>Thank you,</p>
      <p>The Online Learning Team</p>
    </div>`
        };

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "onlinelearningproject2@gmail.com",
                pass: "enmhdbutzpyrjqoq "
            }
        });

        await transporter.sendMail(passwordMsg);
        console.log("Password reset email sent successfully");
    } catch (err) {
        console.error("Error sending password reset email:", err.message);
        throw new Error("Failed to send password reset email");
    }
};





module.exports = {
    sendPasswordResetLink,
};