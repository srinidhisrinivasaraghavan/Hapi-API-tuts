'use strict';
const Hapi = require('hapi');
const mongojs = require('mongojs');
var Inert = require('inert');
var Vision = require('vision');
var Handlebars = require('handlebars');

var databaseConfig = require('./config/db');
var entityPlugin = require('./routes/entity-routes');
var companyPlugin = require('./routes/company-routes');
var rolePlugin = require('./routes/role-routes');
var Entity = require('./models/entity-model');


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
	},
	{
		register:Inert
	},
	{
		register:Vision
	}
],
	 (err) => {
  		if (err) {
    		throw err;
  		}
  		//Configure template support
		server.views({
			engines:{
				html:Handlebars
			},
			path:__dirname+'/public/views',
			layout:true //Layout.html is a common Layout page for all pages
		}, function(err){
			if(err){
				console.log('errr');
			}
		});
		// Start the server
		server.start((err) => {
    		if (err) {
        		throw err;
    		}
    		console.log('Server running at:', server.info.uri);
		});
});