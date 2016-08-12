'use strict';

const Boom = require('boom');  
const uuid = require('node-uuid');  
const Joi = require('joi');
var status = require('hapi-status');

var Company = require('../models/company-model');
var companyValidation = require('../validations/company-validation');

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
      var company = new Company(request.payload);
       db.companies.save(company,function(err, savedCompany){
            if(err){
                console.log('error while saving company');
                return reply (Boom.wrap(err,'Internal mongo error'));
            }
            status.created(reply,savedCompany);
        });          
    },
    config:companyValidation
});
next();
}

exports.register.attributes = {  
  name: 'company-routes'
};