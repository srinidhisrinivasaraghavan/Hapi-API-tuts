const nodemailer = require('nodemailer');
const emailConfig = require('../config/config').email;
const crypto = require('crypto');

var Token = require('../models/token-model').Token;

var transporter = nodemailer.createTransport({
        service: emailConfig.service,
        auth: {
            user: emailConfig.user, // Your email id
            pass: emailConfig.password // Your password
        }
    });

module.exports.sendEmail =function(subject, body, email,entityId){
    crypto.randomBytes(48, function(err, buffer) {
        var token = createTokenAndSave(buffer,entityId);

        var mailOptions = {
        from: emailConfig.user, // sender 
        to: email, //  receivers
        subject: subject, // Subject 
        text: body + token //, // plaintext body
        // html: '<b>Hello world ✔</b>' // You can choose to send an HTML body instead
        };

        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                console.log(error);
            }else{
                console.log('Message sent: ' + info.response);
            }
        });

    });
}

function createTokenAndSave(buffer,entityId){
    var tokenValue = buffer.toString('hex');
    Token.findOne({"entityId":entityId},function(err,existingToken){
        if(existingToken){
            Token.remove({"entityId":entityId }, function(err) {
                if (err) {
                    console.log('error deleting tokens');
                }
            });
        }
        var TOKEN = new Token();
        TOKEN.entityId=entityId;
        TOKEN.tokenValue=tokenValue;
        TOKEN.save(TOKEN,function(err, savedToken){
            if(err){
                console.log('error while saving Token' ,err);
            }
        });
          
    });   
    return tokenValue;  
}