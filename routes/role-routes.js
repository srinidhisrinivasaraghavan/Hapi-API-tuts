'use strict';

const Boom = require('boom');  
const uuid = require('node-uuid');  
const Joi = require('joi');

exports.register = function(server, options, next) {

//GET 
//Get all roles
server.route({  
    method: 'GET',
    path: '/roles',
    handler: function (request, reply) {
        console.log(request);
        var roleNames=[];
       //TODO : get the roles from data base and return in an array
        reply("GET");
    }
});

//POST
//Create a legal entity
server.route({
    method:"POST",
    path:'/role',
    handler:function(request,reply){
        var role = request.payload;
        //TODO: 2. Save these fields in DB
        reply('POST');           
    },
    config:{
        validate:{
            payload:{
                role: Joi.string().max(50).required()
            }
        }
    }
});
next();
}

exports.register.attributes = {  
  name: 'role-routes'
};