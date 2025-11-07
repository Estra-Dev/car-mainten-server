import nodemailer from 'nodemailer';



export const sendEmail = async ({to, subject, text, html}) => {

  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    if(!to){
      console.log("No recipient email provided");
      return false
    }

    transporter.verify((error, success) => {
      if (error) console.error("SMTP connection error:", error);
      else console.log("SMTP connection success:", success);
    });
    

    console.log(subject, text, html);
    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log(
      "EMAIL_PASS:",
      process.env.EMAIL_PASS ? "✔️ loaded" : "❌ missing"
    );
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: `"Vehicle Management System" <${process.env.EMAIL_USER}>`, // sender address
      to,
      subject,
      text,
      html,
    });

    console.log("Email sent: %s", info.messageId);
    return true
  } catch (error) {
    console.log("Error sending email: ", error);
    return false
  }


  // async function testEmail() {
  //   let transporter = nodemailer.createTransport({
  //     service: "gmail",
  //     auth: {
  //       user: process.env.EMAIL_USER,
  //       pass: process.env.EMAIL_PASS,
  //     },
  //   });

  //   try {
  //     let info = await transporter.sendMail({
  //       from: process.env.EMAIL_USER,
  //       to: "dominionib@gmail.com",
  //       subject: "SMTP Test",
  //       text: "Hello from Nodemailer",
  //     });
  //     console.log("✅ Test email sent:", info.messageId);
  //   } catch (error) {
  //     console.error("❌ Error:", error);
  //   }
  // }

  // testEmail();
}