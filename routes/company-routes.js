'use strict';

var handlers = require('../handlers/company-handlers');
var companyValidation = require('../validations/company-validation');

exports.register = function(server, options, next) {
const db = server.app.db;
//GET 
//Get all companies
server.route({  
    method: 'GET',
    path: '/companies',
    handler: handlers.handleGetCompanies,
    config:{
    	tags: ['api']
    }
});

//POST
//Create a legal entity
server.route({
    method:"POST",
    path:'/company',
    handler:handlers.handlePostCompanies,
    config:{
    	validate:companyValidation,
    	tags: ['api']
    }
});
next();
}

exports.register.attributes = {  
  name: 'company-routes'
};