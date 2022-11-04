/*
tellevoappemail@gmail.com
23TeLLevoApp12!
*/

const nodemailer = require('nodemailer');
const fsPromises = require('fs').promises;

async function getEmailTemplate(path) {
    // The content will be available after finished reading
    // './email-template.txt'
    const content = await fsPromises.readFile(path);
    return content;
}

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'tellevoappemail@gmail.com',
        pass: '23TeLLevoApp12!'
    }
});

/*
var mailOptions = {
    from: 'tellevoappemail@gmail.com',
    to: '',
    subject: '',
    html: ''
};
*/

async function sendEmail(options) {
    options.from = 'tellevoappemail@gmail.com'
    transporter.sendMail(options); /*, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });*/
}