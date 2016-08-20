const Boom = require('boom');
const status = require('hapi-status');
const mongoose = require('mongoose');

const Entity= require('../models/entity-model').Entity;
const Contract= require('../models/entity-model').Contract;
const Token= require('../models/token-model').Token;
const CONTRACT_STATUS = require('../config/constants').CONTRACT_STATUS;
const email = require('../email/email');
const entityDB = require('../data_access/entity-db');
const tokenDB = require('../data_access/token-db');

//Get all Entities 
module.exports.handleGetEntites = function(request, reply) {
    entityDB.findAll(function(err,docs){
        if (err) {
            return reply(Boom.wrap(err));
        }
        status.ok(reply, docs);
    });
}
//Create new Entity 
module.exports.handlePostEntity = function(request, reply) {
    var entity = CreateNewEntity(request.payload)
    entityDB.save(entity, function(err, savedEntity) {
        if (err) {
            return reply(Boom.wrap(err));
        }
        status.created(reply, savedEntity);
    });     
}
//Get one Entity 
module.exports.handleGetEntity = function(request, reply) {
    entityDB.findOne(request.params.id, function(err, entity, code) {
        if(err){
            return reply(Boom.wrap(err, code, err.message));
        }
        reply(entity);
    });
}
//Update an Entity
module.exports.handlePutEntity =function(request,reply){
    var setObject=CreateUpdatedEntityObject(request);
    entityDB.Update(request.params.id, setObject, function(err,savedEntity,code){
        if (err) {
            return reply(Boom.wrap(err,code,err.message));
        }
        status.ok(reply,savedEntity);
    });
}
//Update contract status on sending email
module.exports.handlePatchEntitySendEmail = function(request, reply) {
    var setObject=CreateUpdatedSendEmailObject();
    entityDB.Update(request.params.id, setObject, function(err,savedEntity,code){
        if (err) {
            return reply(Boom.badRequest(err,code,err.message));
        }
        var text = 'Please click on link to confirm account  '+ 'http://localhost:3000' +'/entity/'+savedEntity._id+'/confirm/';
        email.sendEmail('Confirmation Email',text, savedEntity.contract.email, savedEntity._id);
        reply(savedEntity);
    });
    //TODO: Put this as separate method
}
//Activate Account on email confirmation 
module.exports.handleGetEntityConfirm = function(request, reply) {
    tokenDB.findOne(request.params.id, request.params.token, function(err,token){
        if(err){
            return reply(Boom.badRequest(err, token)); 
        }
        var setObject =CreateUpdatedEmailConfirmedObject();
        entityDB.Update(request.params.id, setObject, function(err,savedEntity,code){
            if (err) {
                return reply(Boom.badRequest(err,code,err.message));
            }
            tokenDB.removeOne(request.params.id,request.params.token,function(err,token){
                if(err){
                    return reply(Boom.badRequest(err,'Error'));
                }
                var text = 'You have successfully confirmed your aacount. Please click on link to create password '+ 'http://localhost:3000/entity/'+savedEntity._id+'/password/';
                email.sendEmail('Create Password',text, savedEntity.contract.email, savedEntity._id);    
                reply.view('message', {message:"Email Confirmation Success"}); 
            });    
        });
    });
}
//Temp page to take password as input 
module.exports.handleGetPassword = function(request,reply){
    reply.view('password');
}
//update password _DONE
module.exports.handlePatchEntityPassword = function(request, reply) {
    var setObject=CreateUpdatedPasswordObject(request);
    entityDB.Update(request.params.id, setObject, function(err,savedEntity){
        if (err) {
            return reply(Boom.badRequest(err,'Error'));
        }
        reply(savedEntity);
    });
}
//update contract status from UI
module.exports.handlePatchContractSigned = function(request, reply) {
    var setObject=CreateUpdatedContractSignedObject();
     entityDB.Update(request.params.id, setObject, function(err,savedEntity){
        if (err) {
            return reply(Boom.badRequest(err,'Error'));
        }
        reply(savedEntity);
    });
}

module.exports.handleGetIfEmailExists =function(request,reply){
    entityDB.findIfEntityExists(request.params.email, function(err, isExist){
        if(err){
            return reply(Boom.wrap(err));
        }
        reply(isExist);
    });
}
/* Section Helpers */
function CreateNewEntity(payload){
    var date =getCurrentDate();
    var entity = new Entity(payload);
    entity.contract = new Contract(payload);
    entity.contract.status= payload.skipContract ? CONTRACT_STATUS.SENT_SIGNED : CONTRACT_STATUS.NOT_SENT;
    entity.contract.pdfVersion= '';
    entity.contract.dateConfirmed= payload.skipContract ?date:'';
    entity.accountActivated = payload.skipContract ? true : false;
    entity.password = null;
    entity.dateCreated= date;   
    return entity;
}

function CreateUpdatedEntityObject(request){
   var setObject={
        'contract.firstName':request.payload.firstName,
        'contract.lastName':request.payload.lastName,
        'address':request.payload.address,
        'contract.email' : request.payload.email,
        'username':request.payload.username,
        'contract.companyName':request.payload.companyName,
        'role':request.payload.role
    }
    return setObject;
}

function CreateUpdatedSendEmailObject(){
    var setObject={
        "accountActivated" :false,
        "contract.status": CONTRACT_STATUS.SENT_PENDING,
        "contract.dateSent" :getCurrentDate()
    }
    return setObject;
}

function CreateUpdatedPasswordObject(request){
    var setObject={
        "password":request.payload.password
    }
    return setObject;
}

function CreateUpdatedContractSignedObject(){
    var setObject={
        'skipContract' :true,
        'accountActivated' :true,
        'contract.status':CONTRACT_STATUS.SENT_SIGNED,
        'contract.dateConfirmed':getCurrentDate()
    }
    return setObject;
}

function CreateUpdatedEmailConfirmedObject(){
    var setObject={
        'accountActivated' :true,
        'contract.status':CONTRACT_STATUS.SENT_SIGNED,
        'contract.dateConfirmed':getCurrentDate()
    }
    return setObject;
}

function getCurrentDate(){
    var DATE = new Date();
    var date = DATE.getDate();
    var month = DATE.getMonth();
    var year = DATE.getFullYear();
    var hours = DATE.getHours();
    var minutes = DATE.getMinutes();
    return `${month+1}/${date}/${year} ${hours} H : ${minutes} M`;
}

