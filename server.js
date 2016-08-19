'use strict';
const Hapi = require('hapi');
const Inert = require('inert');
const Vision = require('vision');
const Handlebars = require('handlebars');
const HapiSwagger = require('hapi-swagger');

const entityPlugin = require('./routes/entity-routes');
const companyPlugin = require('./routes/company-routes');
const rolePlugin = require('./routes/role-routes');
const Entity = require('./models/entity-model');
const config = require('./config/config');

// Create a server with a host and port
const server = new Hapi.Server();  
server.connection({  
	host:config.server.host,
    port: config.server.port,
    routes: { cors: true }
});

const swaggerOptions = {
    info: {
            'title': 'Test API Documentation'
        }
    };

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
	},
	{
        register: HapiSwagger,
        options: swaggerOptions
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