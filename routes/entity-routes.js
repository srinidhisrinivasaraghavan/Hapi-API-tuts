'use strict';

var validations = require('../validations/entity-validation');
var handlers = require('../handlers/entity-handlers');

exports.register = function(server, options, next) {
//Get 
//Get all legal entites
server.route({  
    method: 'GET',
    path: '/entities',
    handler: handlers.handleGetEntites
});

//POST
//Create a legal entity
server.route({
    method:"POST",
    path:'/entities',
    handler:handlers.handlePostEntity,
    config:validations.entityValidation
});

//PATCH
//update contract status on email 
server.route({  
    method: 'PATCH',
    path: '/entity/{id}/sendemail',
    handler: handlers.handlePatchEntitySendEmail
});

//PATCH
//update contract status on confirm
server.route({  
    method: 'PATCH',
    path: '/entity/{id}/confirm',
    handler: handlers.handlePatchEntityConfirm
});


//PATCH
//update entity on password creation
server.route({  
    method: 'PATCH',
    path: '/entity/{id}/password',
    handler: handlers.handlePatchEntityPassword,
    config:validations.passwordValidation
});

next();
}

exports.register.attributes = {  
  name: 'entity-routes'
};