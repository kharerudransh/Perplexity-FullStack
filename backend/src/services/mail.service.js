import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
//this transporter works between http and smtp
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.GOOGLE_USER,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
  },
});
// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});


export async function sendEmail({to,subject,html,text}){
    const mailOptions = {
        from:process.env.GOOGLE_USER,
        to,
        subject,
        html,
        text,
    }
    const details=await transporter.sendMail(mailOptions);
    console.log("Email sent",details);
}
