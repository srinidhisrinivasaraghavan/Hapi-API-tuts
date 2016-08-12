'use strict';

const Boom = require('boom');  
const uuid = require('node-uuid');  
const Joi = require('joi');
var status = require('hapi-status');

exports.register = function(server, options, next) {
const db = server.app.db;
//GET 
//Get all companies
server.route({  
    method: 'GET',
    path: '/companies',
    handler: function (request, reply) {
        console.log(request);
        var companies=[];
       //TODO : get the companies from data base and return in an array
        reply('GET');
    }
});

//POST
//Create a legal entity
server.route({
    method:"POST",
    path:'/company',
    handler:function(request,reply){
      //TODO: Create Model
      //TODO: Create Object of Model
      //TODO: Validate
      //TODO: save
      //TODO: return 201
       db.companies.save(company,function(err, savedCompany){
            if(err){
                console.log('error while saving company');
                return reply (Boom.wrap(err,'Internal mongo error'));
            }
            status.created(reply,savedCompany);
        });          
    },
    config:{
        validate:{
            payload:{
                companyName: Joi.string().max(50).required()
            }
        }
    }
});
next();
}

exports.register.attributes = {  
  name: 'company-routes'
};