'use strict';

var handlers = require('../handlers/role-handlers');
var roleValidation = require('../validations/role-validation');

exports.register = function(server, options, next) {
//GET 
//Get all roles
server.route({  
    method: 'GET',
    path: '/roles',
    handler: handlers.handleGetRoles
});

//POST
//Create a legal entity
server.route({
    method:"POST",
    path:'/role',
    handler:handlers.handlePostRoles,
    config:roleValidation
});
next();
}

exports.register.attributes = {  
  name: 'role-routes'
};