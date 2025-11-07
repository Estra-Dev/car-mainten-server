import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const sendEmail = async ({to, subject, text, html}) => {

  if(!to){
    console.log("No recipient")
    return;
  }

  try {
    // create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      // host: "smtp.gmail.com",
      // port: 587,
      // secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      }
    });

    await transporter.verify();
    console.log("SMPT connection verified")

    const info = await transporter.sendMail({
      from: `Vehicle Management System <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html
    })

    console.log("Email sent successfully:", info.messageId);
    return info;
  }catch (error) {
    console.error("Error sending email:", error.message);
  }
}

console.log(process.env.TEST_EMAIL_RECIPIENT)

// await sendEmail({
//   to: "dominikolyson@gmail.com",
//   subject: "Test Email from Vehicle Management System",
//   text: "This is a test email to verify the email sending functionality.",
//   html: "<h1>This is a test email to verify the email sending functionality.</h1>"
// })


// create transporter
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: true,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   }

// })

// // verify connection and send test email
// async function testMail() {
//   try {
//     console.log("Verifying SMTP connection...")
//     await transporter.verify();
//     console.log("SMTP connection verified successfully.");

//     const info = await transporter.sendMail({
//       from: `Vehicle Management System <${process.env.EMAIL_USER}>`,
//       to: process.env.TEST_EMAIL_RECIPIENT,
//       subject: "Test Email - Vehicle Management System",
//       text: "This is a test email sent from the Vehicle Management System to verify SMTP configuration.",
//       html: "<h1>This is a test email sent from the Vehicle Management System to verify SMTP configuration.</h1>"
//     });

//     console.log("Test email sent successfully:", info.response);
//   } catch (error) {
//     console.log("Email test failed", error.message);
//   }
// };

// testMail();