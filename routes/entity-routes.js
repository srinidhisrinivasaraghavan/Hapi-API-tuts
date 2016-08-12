'use strict';

const Boom = require('boom');  
const uuid = require('node-uuid');  
const Joi = require('joi');
var status = require('hapi-status');

var Entity = require('../models/entity-model');
var entityValidation = require('../validations/entity-validation');
var CONTRACT_STATUS = require('../config/constants').CONTRACT_STATUS;

exports.register = function(server, options, next) {
const db = server.app.db;
//Get 
//Get all legal entites
server.route({  
    method: 'GET',
    path: '/entities',
    handler: function (request, reply) {
        console.log(db);
          db.entities.find({},{'_schema':0, '_fields':0},(err, docs) => {
            if (err) {
                return reply(Boom.wrap(err, 'Internal MongoDB error'));
            }
            console.log(docs);
            status.ok(reply,docs);
        });
    }
});

//POST
//Create a legal entity
server.route({
    method:"POST",
    path:'/entities',
    handler:function(request,reply){
        var payload = request.payload;
        var entity = new Entity(request.payload);
        entity.accountActivated=false;
        entity.contract ={
                status:CONTRACT_STATUS.NOT_SENT,
                pdfVersion:'',
                date: new Date(),
            };
        console.log(entity);
        db.entities.save(entity,function(err, savedEntity){
            if(err){
                console.log('error while saving entity');
                return reply (Boom.wrap(err,'Internal mongo error'));
            }
            status.created(reply,savedEntity);
        });
        // ASK: pdf version
        // BUG: Date in Mongo       
    },
    config:entityValidation
});

//PATCH
//update contract status on email 
server.route({  
    method: 'PATCH',
    path: '/entity/{id}/sendemail/',
    handler: function (request, reply) {
     //TODO: 1. update the details in db = contract.status, date
     //TODO: 2. send an email with contract pdf and activation link
     reply('PATCH1');
    }
});

//PATCH
//update contract status on confirm
server.route({  
    method: 'PATCH',
    path: '/entity/{id}/confirm/',
    handler: function (request, reply) {
     //TODO: 1. update the details in db = contract.status, date, account_activated
     //TODO: 2. send an email with link to create password
     reply('PATCH2');
    }
});

//PATCH
//update entity on password creation
server.route({  
    method: 'PATCH',
    path: '/entity/{id}/password/',
    handler: function (request, reply) {
     //TODO: 1. validate password fields
     //TODO: 1. update the details in db = password
     reply('PATCH3');
    }
});

next();
}

exports.register.attributes = {  
  name: 'entity-routes'
};