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
    handler: handlers.handleGetCompanies
});

//POST
//Create a legal entity
server.route({
    method:"POST",
    path:'/company',
    handler:handlers.handlePostCompanies,
    config:companyValidation
});
next();
}

exports.register.attributes = {  
  name: 'company-routes'
};