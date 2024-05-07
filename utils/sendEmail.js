const nodemailer = require("nodemailer");

const sendEmail = async(option) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD
        },
    })

    const mailOptions = {
        from: process.env.SMTP_MAIL,
        cc: process.env.SMTP_MAIL,
        to: option.email,
        subject: option.subject,
        text: option.message
    }

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail