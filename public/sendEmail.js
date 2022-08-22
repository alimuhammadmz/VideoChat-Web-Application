var nodemailer = require('nodemailer');

function sendEmail(meetLink, userMail){
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });

    var mailOptions = {
        from: EMAIL,
        to: userMail,
        subject: 'Meeting Link - VideoChat',
        text: `Meeting Link:\n${meetLink}\n\nDON\'T SHARE THIS LINK WITH SOMEONE ELSE!`
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports.sendEmail = sendEmail;