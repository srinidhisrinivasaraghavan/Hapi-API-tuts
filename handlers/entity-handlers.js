const Boom = require('boom');
const status = require('hapi-status');
const mongoose = require('mongoose');

const Entity= require('../models/entity-model').Entity;
const Contract= require('../models/entity-model').Contract;
const Token= require('../models/token-model').Token;
const CONTRACT_STATUS = require('../config/constants').CONTRACT_STATUS;
const email = require('../email/email');
const DB = require('../data_access/db');
const tokenDB = require('../data_access/token-db');

//Get all Entities 
module.exports.handleGetEntites = function(request, reply) {
    DB.findAll(Entity, function(err,docs){
        if (err) {
            return reply(Boom.wrap(err));
        }
        status.ok(reply, docs);
    });
}
//Create new Entity 
module.exports.handlePostEntity = function(request, reply) {
    var entity = CreateNewEntity(request.payload)
    DB.save(entity, function(err, savedEntity,code) {
        if (err) {
            return reply(Boom.wrap(err,code,err.message));
        }
        status.created(reply, savedEntity);
    });     
}
//Get one Entity 
module.exports.handleGetEntity = function(request, reply) {
    DB.findOne(Entity, request.params.id, function(err, entity, code) {
        if(err){
            return reply(Boom.wrap(err, code, err.message));
        }
        status.ok(reply,entity);
    });
}
//Update an Entity
module.exports.handlePutEntity =function(request,reply){
    var setObject=CreateUpdatedEntityObject(request);
    DB.Update(Entity, request.params.id, setObject, function(err,savedEntity,code){
        if (err) {
            return reply(Boom.wrap(err,code,err.message));
        }
        status.ok(reply,savedEntity);
    });
}
//Update contract status on sending email
module.exports.handlePatchEntitySendEmail = function(request, reply) {
    var setObject=CreateUpdatedSendEmailObject();
    DB.Update(Entity,request.params.id, setObject, function(err,savedEntity,code){
        if (err) {
            return reply(Boom.wrap(err,code,err.message));
        }
        var text = 'Please click on link to confirm account  '+ 'http://localhost:3000' +'/entity/'+savedEntity._id+'/confirm/';
        email.sendEmail('Confirmation Email',text, savedEntity.contract.email, savedEntity._id , savedEntity.contract.firstName);
        status.ok(reply,savedEntity);
    });
}
//Activate Account on email confirmation 
module.exports.handleGetEntityConfirm = function(request, reply) {
    tokenDB.findOneByEntityToken(request.params.id, request.params.token, function(err,token,code){
        if(err){
            return reply.view('message', {message:'Link invalid or expired. Please contact AM Support team to resolve.'}); 
        }
        var setObject =CreateUpdatedEmailConfirmedObject();
        DB.Update(Entity,request.params.id, setObject, function(err,savedEntity,code){
            if (err) {
                return reply(Boom.wrap(err,code,err.message));
            }
            tokenDB.removeOneByEntityToken(request.params.id,request.params.token,function(err,token,code){
                if(err){
                    return reply(Boom.wrap(err,code,err.message));
                }
                var text = 'You have successfully confirmed your account. Please click on link to create password '+ 'http://localhost:3000/entity/'+savedEntity._id+'/password/';
                email.sendEmail('Create Password',text, savedEntity.contract.email, savedEntity._id, savedEntity.contract.firstName);    
                reply.view('message', {message:"Success! Your Account is activated. You will get an email from Audible Magic with instructions to create password."}); 
            });    
        });
    });
}
//Temp page to take password as input 
module.exports.handleGetPassword = function(request,reply){
    tokenDB.findOneByEntityToken(request.params.id, request.params.token, function(err,token,code){
        if(err){
            return reply.view('message', {message:'Link invalid or expired. Please contact AM Support team to resolve.'}); 
        }
        reply.view('password',{id:request.params.id, token:request.params.token});
    });
}
//update password _DONE
module.exports.handlePatchEntityPassword = function(request, reply) {
    console.log("1");
    tokenDB.findOneByEntityToken(request.params.id, request.payload.token, function(err,token,code){
        if(err){
            return reply.view('message', {message:'Error Updating password. Reason: '+err.message+'. Please contact AM Support team to resolve.'}); 
        } 
    });
    //TODO : Redirect cz of URL issues
    var setObject=CreateUpdatedPasswordObject(request);
    DB.Update(Entity, request.params.id, setObject, function(err,savedEntity,code){
        if (err) {
            return reply(Boom.wrap(err,code,err.message));
        }
        tokenDB.removeOneByEntityToken(request.params.id,request.payload.token,function(err,token,code){
            if(err){
                return reply.view('message', {message:'Error. Please contact AM Support team to resolve.'}); 
            }
            status.ok(reply,savedEntity);
        });
    });
}
//update contract status from UI
module.exports.handlePatchContractSigned = function(request, reply) {
    var setObject=CreateUpdatedContractSignedObject();
     DB.Update(Entity, request.params.id, setObject, function(err,savedEntity,code){
        if (err) {
            return reply(Boom.wrap(err,code,err.message));
        }
        status.ok(reply,savedEntity);
    });
}

module.exports.handleGetIfEmailExists =function(request,reply){
    DB.findIfDocumentExists(Entity, {"contract.email":request.params.email}, function(err, isExist, docId){
        if(err){
            return reply(Boom.wrap(err));
        }
        var result = {isExist : isExist, docId : docId};
        status.ok(reply,result);
    });
}
/* Section Helpers */
function CreateNewEntity(payload){
    var date =getCurrentDate();
    console.log(getCurrentDate());
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
        $set:{
            'contract.firstName':request.payload.firstName,
            'contract.lastName':request.payload.lastName,
            'address':request.payload.address,
            'contract.email' : request.payload.email,
            'username':request.payload.username,
            'contract.companyName':request.payload.companyName,
            'role':request.payload.role
        }
    }
    return setObject;
}

function CreateUpdatedSendEmailObject(){
    var setObject={
        $set:{
            "accountActivated" :false,
            "contract.status": CONTRACT_STATUS.SENT_PENDING,
            "contract.dateSent" :getCurrentDate()
        }
    }
    return setObject;
}

function CreateUpdatedPasswordObject(request){
    var setObject={
        $set:{
            "password":request.payload.password,
            "datePasswordCreated":getCurrentDate()
        }
    }
    return setObject;
}

function CreateUpdatedContractSignedObject(){
    var setObject={
        $set:{
            'skipContract' :true,
            'accountActivated' :true,
            'contract.status':CONTRACT_STATUS.SENT_SIGNED,
            'contract.dateConfirmed':getCurrentDate()
        }
    }
    return setObject;
}

function CreateUpdatedEmailConfirmedObject(){
    var setObject={
        $set:{
            'accountActivated' :true,
            'contract.status':CONTRACT_STATUS.SENT_SIGNED,
            'contract.dateConfirmed':getCurrentDate()
        }
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
    var seconds = DATE.getSeconds();
    return `${year}-${month+1}-${date} ${hours}:${minutes}:${seconds}`;
}

