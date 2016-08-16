var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'srinidhiraghavan1993@gmail.com', // Your email id
            pass: 'shyampuff' // Your password
        }
    });


