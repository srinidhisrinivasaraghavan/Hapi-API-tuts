'use strict';
const Hapi = require('hapi');
const mongojs = require('mongojs');

var databaseConfig = require('./config/db');
var entityPlugin = require('./routes/entity-routes');
var companyPlugin = require('./routes/company-routes');
var rolePlugin = require('./routes/role-routes');

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