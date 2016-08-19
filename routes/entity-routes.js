'use strict';
var validations = require('../validations/entity-validation');
var entityHandlers = require('../handlers/entity-handlers');

exports.register = function(server, options, next) {
//Get 
//Get all legal entites
server.route({  
    method: 'GET',
    path: '/entities',
    handler: entityHandlers.handleGetEntites,
});

//POST
//Create a legal entity
server.route({
    method:"POST",
    path:'/entities',
    handler:entityHandlers.handlePostEntity,
    config:{
        validate:validations.entityValidationPOST,
        tags:["api"]
    }
});

//GET
//get single entity
server.route({  
    method: 'GET',
    path: '/entity/{id}',
    handler: entityHandlers.handleGetEntity,
    config:{
        tags:["api"]
    }
});

//PUT
//update a single entity
server.route({  
    method: 'PUT',
    path: '/entity/edit/{id}',
    handler: entityHandlers.handlePutEntity,
    config:{
        validate:validations.entityValidationPUT,
        tags:["api"]
    }
});

//PATCH
//update contract status on email 
server.route({  
    method: 'PATCH',
    path: '/entity/{id}/sendemail',
    handler: entityHandlers.handlePatchEntitySendEmail
});

//GET
//update contract status on confirm from Email
server.route({  
    method: 'GET',
    path: '/entity/{id}/confirm/{token}',
    handler: entityHandlers.handleGetEntityConfirm
});

//PATCH
//update contract status on confirm from web UI
server.route({  
    method: 'PATCH',
    path: '/entity/{id}/contractsigned',
    handler: entityHandlers.handlePatchContractSigned,
    config:{
        tags:["api"]
    }
});

//GET
//Temp route : Get Password Creation UI
server.route({  
    method: 'GET',
    path: '/entity/{id}/password/{token}',
    handler: entityHandlers.handleGetPassword
});

//PATCH
//update entity on password creation
server.route({  
    method: 'PATCH',
    path: '/entity/{id}/password',
    handler: entityHandlers.handlePatchEntityPassword,
    config:validations.passwordValidation
});
next();
}

exports.register.attributes = {  
  name: 'entity-routes'
};