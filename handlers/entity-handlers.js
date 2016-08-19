const Boom = require('boom');
const status = require('hapi-status');
const mongoose = require('mongoose');

const Entity= require('../models/entity-model').Entity;
const Contract= require('../models/entity-model').Contract;
const Token= require('../models/token-model').Token;
const CONTRACT_STATUS = require('../config/constants').CONTRACT_STATUS;
const email = require('../email/email');

//Get all Entities _DONE
module.exports.handleGetEntites = function(request, reply) {
    Entity.find({}, {
        '__v': 0
    }, (err, docs) => {
        if (err) {
            return reply(Boom.wrap(err, 'Internal MongoDB error'));
        }
        status.ok(reply, docs);
    });
}
//Create new Entity _DONE
module.exports.handlePostEntity = function(request, reply) {
    var entity = CreateNewEntity(request.payload)
    entity.save(entity, function(err, savedEntity) {
        if (err) {
            console.log('error while saving entity');
            return reply(Boom.badRequest( err, 'Internal mongo error'));
        }
        status.created(reply, savedEntity);
    });     
}
//Get one Entity _DONE
module.exports.handleGetEntity = function(request, reply) {
    Entity.findOne({
        _id: mongoose.Types.ObjectId(request.params.id)
    }, function(err, doc) {
        if(err){
            return reply(Boom.wrap(err, 500, 'Internal MongoDB error'));
        }
        if (!doc) {
            return reply(Boom.notFound('Not found', 'Missing'));
        }
        reply(doc);
    });
}
//Update an Entity
module.exports.handlePutEntity =function(request,reply){
    console.log(request.payload);
    Entity.findOneAndUpdate({_id: mongoose.Types.ObjectId(request.params.id)},
         {$set: 
            {
            'contract.firstName':request.payload.firstName,
            'contract.lastName':request.payload.lastName,
            'address':request.payload.address,
            'contract.email' : request.payload.email,
            'username':request.payload.username,
            'contract.companyName':request.payload.companyName,
            'role':request.payload.role
            }
        },
        {
            upsert:false
        },
        function(err,savedEntity){
            if (err) {
                return reply(Boom.badRequest(err,'Internal MongoDB error'));
            }
            if (!savedEntity) {
                return reply(Boom.badRequest('Invalid data', request.payload));
            }
            reply(savedEntity);
    });
}
//Update contract status on sending email
module.exports.handlePatchEntitySendEmail = function(request, reply) {
    Entity.findOneAndUpdate({_id: mongoose.Types.ObjectId(request.params.id)},
         {$set: 
            {
                "accountActivated" :false,
                "contract.status": CONTRACT_STATUS.SENT_PENDING,
                "contract.dateSent" :getCurrentDate()
            }
        },
        {
            upsert:false
        },
        function(err,savedEntity){
            if (err) {
                return reply(Boom.badRequest(err,'Internal MongoDB error'));
            }
            if (!savedEntity) {
                return reply(Boom.badRequest('Invalid data', request.payload));
            }
            console.log(savedEntity);
            //TODO: hard coded host
            var text = 'Please click on link to confirm account  '+ 'http://localhost:3000' +'/entity/'+savedEntity._id+'/confirm/';//+'/entity/'+entityId+'/confirm/'+token;
            email.sendEmail('Confirmation Email',text, savedEntity.contract.email, savedEntity._id);
            reply(savedEntity);
    });
}
//Activate Account on email confirmation _DONE
module.exports.handleGetEntityConfirm = function(request, reply) {
    Token.findOne({
        entityId: mongoose.Types.ObjectId(request.params.id),
        tokenValue: request.params.token
    }, function(err, token) {
        if (!token) {
            return reply(Boom.badRequest('Invalid data', request.payload));
        }
         Entity.findOneAndUpdate({_id: mongoose.Types.ObjectId(request.params.id)},
         {$set: 
            {
                'accountActivated' :true,
                'contract.status':CONTRACT_STATUS.SENT_SIGNED,
                'contract.dateConfirmed':getCurrentDate()
            }
        },
        {
            upsert:false
        },
        function(err,savedEntity){
            if (err) {
                return reply(Boom.badRequest(err,'Internal MongoDB error'));
            }
            if (!savedEntity) {
                return reply(Boom.badRequest('Invalid data', request.payload));
            }
            Token.find({
                            entityId: mongoose.Types.ObjectId(request.params.id),
                            tokenValue: request.params.token
                            })
                            .remove(function(err) {
                                if (err) {
                                    console.log('Error deleting tokens', err);
                                    return reply(Boom.badRequest(err,'Internal MongoDB error'));
                                }
                                var text = 'You have successfully confirmed your aacount. Please click on link to create password '+ 'http://localhost:3000/entity/'+savedEntity._id+'/password/';//+'/entity/'+entityId+'/confirm/'+token;
                                email.sendEmail('Create Password',text, savedEntity.contract.email, savedEntity._id);
                            });
                        var data = {message:"Email Confirmation Success"};
                        reply.view('message', data);
    });
        /*
        Entity.findOne({
                    _id: mongoose.Types.ObjectId(request.params.id)
                },
                function(err,entity){
                    if(err){
                        return reply(Boom.badRequest(err,'Internal MongoDB error'));
                    }
                    if(!entity){
                        return reply(Boom.badRequest('Invalid data', request.payload));
                    }
                    entity.accountActivated =true;
                    entity.contract.status=CONTRACT_STATUS.SENT_SIGNED;
                    entity.contract.dateConfirmed =getCurrentDate();
                    entity.save(entity,function(err){
                        if(err){
                            return reply(Boom.badRequest(err,'Internal MongoDB error'));
                        }
                        Token.find({
                            entityId: mongoose.Types.ObjectId(request.params.id),
                            tokenValue: request.params.token
                            })
                            .remove(function(err) {
                                if (err) {
                                    console.log('Error deleting tokens', err);
                                    return reply(Boom.badRequest(err,'Internal MongoDB error'));
                                }
                                var text = 'You have successfully confirmed your aacount. Please click on link to create password '+ 'http://localhost:3000/entity/'+doc._id+'/password/';//+'/entity/'+entityId+'/confirm/'+token;
                                email.sendEmail('Create Password',text, entity.contract.email, doc._id);
                            });
                        var data = {message:"Email Confirmation Success"};
                        reply.view('message', data);
                    });
                });*/
    });
}
//Temp page to take password as input _DONE
module.exports.handleGetPassword = function(request,reply){
    reply.view('password');
}
//update password _DONE
module.exports.handlePatchEntityPassword = function(request, reply) {
    Entity.findOneAndUpdate({_id: mongoose.Types.ObjectId(request.params.id)},
         {$set: 
            {
                'password': request.payload.password
            }
        },
        {
            upsert:false
        },
        function(err,savedEntity){
            if (err) {
                return reply(Boom.badRequest(err,'Internal MongoDB error'));
            }
            if (!savedEntity) {
                return reply(Boom.badRequest('Invalid data', request.payload));
            }
            reply(savedEntity);
    });
}
//update contract status from UI
module.exports.handlePatchContractSigned = function(request, reply) {
    Entity.findOneAndUpdate({_id: mongoose.Types.ObjectId(request.params.id)},
         {$set: 
            {
                'skipContract' :true,
                'accountActivated' :true,
                'contract.status':CONTRACT_STATUS.SENT_SIGNED,
                'contract.dateConfirmed':getCurrentDate()
            }
        },
        {
            upsert:false
        },
        function(err,savedEntity){
            if (err) {
                return reply(Boom.badRequest(err,'Internal MongoDB error'));
            }
            if (!savedEntity) {
                return reply(Boom.badRequest('Invalid data', request.payload));
            }
            reply(savedEntity);
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

function getCurrentDate(){
    var DATE = new Date();
    var date = DATE.getDate();
    var month = DATE.getMonth();
    var year = DATE.getFullYear();
    var hours = DATE.getHours();
    var minutes = DATE.getMinutes();
    return `${month+1}/${date}/${year} ${hours} H : ${minutes} M`;
}

