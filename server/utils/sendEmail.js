
import nodemailer from "nodemailer";

// async..await is not allowed in global scope, must use a wrapper
const sendEmail = async function (email, subject, message){
    //create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      service: "gmail",
      port: 465,
      secure: true, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    });
    
    
    // send mail with defined transport object
    await transporter.sendMail({
      from: process.env.SMTP_USERNAME, // sender address
      to: email, // list of receivers //user email
      subject: subject, // Subject line
      html: message, // html body
    });
};
    
export default sendEmail;
