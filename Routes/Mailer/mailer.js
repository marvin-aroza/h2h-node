const express = require('express')
const route = express.Router();
const nodemailer = require('nodemailer');

const sendEmail = require('../../Middleware/mailer');


const transporter = nodemailer.createTransport({
    port: 465,
    host: "smtp.gmail.com",
    auth: {
        user: 'developertom23@gmail.com',
        pass: 'Developer@1995',
    },
    secure: true, // upgrades later with STARTTLS -- change this based on the PORT
});

route.post('/text-mail', (req, res) => {
    const response = sendEmail(req);

    res.status(200).json({
        code: 200,
        message: "Email sent successfully",
        data: response,
        status: true
      });
    // const {to, subject, text } = req.body;
    // const mailData = {
    //     from: 'marvinaroza@gmail.com',
    //     to: to,
    //     subject: subject,
    //     text: text,
    //     html: '<b>Hey there! </b><br> This is our first message sent with Nodemailer<br/>',
    // };

    // transporter.sendMail(mailData, (error, info) => {
    //     if (error) {
    //         return console.log(error);
    //     }
    //     res.status(200).send({ message: "Mail send", message_id: info.messageId });
    // });

});


route.post('/attachments-mail', (req, res) => {
    const {to, subject, text } = req.body;
    const mailData = {
        from: 'youremail@gmail.com',
        to: to,
        subject: subject,
        text: text,
        html: '<b>Hey there! </b><br> This is our first message sent with Nodemailer<br/>',
        attachments: [
            {   // file on disk as an attachment
                filename: 'nodemailer.png',
                path: 'nodemailer.png'
            },
            {   // file on disk as an attachment
                filename: 'text_file.txt',
                path: 'text_file.txt'
            }
        ]
    };

    transporter.sendMail(mailData, (error, info) => {
        if (error) {
            return console.log(error);
        }
        res.status(200).send({ message: "Mail send", message_id: info.messageId });
    });
});

module.exports = route