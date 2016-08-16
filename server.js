'use strict';
const Hapi = require('hapi');
const mongojs = require('mongojs');

var databaseConfig = require('./config/db');
var entityPlugin = require('./routes/entity-routes');
var companyPlugin = require('./routes/company-routes');
var rolePlugin = require('./routes/role-routes');
var Entity = require('./models/entity-model');

//1. Email verification
/////////////////////////////////////////////////////////////////

//TODO: 1 put the email stuff in separate file
//TODO: 2 call email while registering with return URL from request itself
//TODO: 3 save the token in DB, separate collection
//TODO: 4 check token in DB while confirming
    //Token 1. create Index while creating DB 1st time
    //Token 2. to change drop Index and re create Index
//TODO: 5 Error if token is different or expired
//TODO: 6 delete token if more than some time, TTL mongo
//TODO: 7 resend email
/*var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'sender.account@gmail.com', // Your email id
            pass: 'senderpassword' // Your password
        }
    });




require('crypto').randomBytes(48, function(err, buffer) {
  var token = buffer.toString('hex');
  var text = 'http://localhost:3000/entity/57ae41f09b45971604d1b297/confirm/'+token;
  var mailOptions = {
    from: 'sender.accout@gmail.com', // sender address
    to: 'to@gmail.com', // list of receivers
    subject: 'Email Example', // Subject line
    text: text //, // plaintext body
    // html: '<b>Hello world ✔</b>' // You can choose to send an HTML body instead
	};
	transporter.sendMail(mailOptions, function(error, info){
    if(error){
        console.log(error);
    }else{
        console.log('Message sent: ' + info.response);
    };
});

});*/




/////////////////////////////////////////////////////////////////
//2. Password reset link

//TODO1. On validation user, call to send email with link,userId,token
//TODO2. user clicks on link, password page and user resets password

/////////////////////////////////////////////////


// Create a server with a host and port
const server = new Hapi.Server();  
server.connection({  
	host:'localhost',
    port: 3000,
    routes: { cors: true }
});

//Connect to database
//var db = mongojs('mydb', ['mycollection']) //for localhost
var collections = ['entities','companies','roles'];
server.app.db= mongojs(databaseConfig.url, collections);

//Load plugins and start server
server.register([
	{
		register:entityPlugin
	},
	{
		register:companyPlugin
	},
	{
		register:rolePlugin	
	}
],
	 (err) => {
  		if (err) {
    		throw err;
  		}
		// Start the server
		server.start((err) => {
    		if (err) {
        		throw err;
    		}
    		console.log('Server running at:', server.info.uri);
		});
});