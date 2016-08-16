const Boom = require('boom'); 
const status = require('hapi-status');
const mongojs = require('mongojs');

const databaseConfig = require('../config/db');
var Entity = require('../models/entity-model');
var CONTRACT_STATUS = require('../config/constants').CONTRACT_STATUS;
var email = require('../email/email');

const db= databaseConfig.db;

module.exports.handleGetEntites =function (request, reply) {
    db.entities.find({},{'_schema':0, '_fields':0},(err, docs) => {
    	if (err) {
        	return reply(Boom.wrap(err, 'Internal MongoDB error'));
    	}
    	status.ok(reply,docs);
    });
}

module.exports.handlePostEntity =function(request,reply){
    	var payload = request.payload;
        var URL = request.payload.url;
        console.log(URL);
        
        delete payload.url;
        var entity = new Entity(payload);
        entity.accountActivated=payload.skipContract?true:false;
        entity.password=null;
        entity.contract ={
                status:payload.skipContract?CONTRACT_STATUS.SENT_SIGNED:CONTRACT_STATUS.NOT_SENT,
                pdfVersion:'',
                dateCreated: new Date(),
            };
        db.entities.save(entity,function(err, savedEntity){
            if(err){
                console.log('error while saving entity');
                return reply (Boom.wrap(err,'Internal mongo error'));
            }
            //email.sendConfirmationEmail(savedEntity._id, URL, savedEntity.email);
            status.created(reply,savedEntity);
        });
        // ASK: pdf version      
    }

module.exports.handlePatchEntitySendEmail =function (request, reply) {
          var url = request.payload;
          //TODO: Use this URL to pop a message to user
          db.entities.findAndModify({
     		query: { _id: mongojs.ObjectId(request.params.id) },
     		update: { 
     					$set:{ 
     							"accountActivated": false,
     							"contract.status":CONTRACT_STATUS.SENT_PENDING,
                  "contract.dateSent":new Date()
     						}
     				},
    		new: true
    		},
    		function (err, entity, lastErrorObject) {
        		if(err){
            	   return reply(Boom.wrap(err,500, 'Internal MongoDB error'));
        	    }
                if(!entity){
                    return reply(Boom.badRequest('Invalid data',request.payload));
                }
                //TODO: hard coded host
                email.sendConfirmationEmail(entity._id, 'http://localhost:3000', entity.email);
        	    reply(entity);
    	});
    }

module.exports.handlePatchEntityConfirm =function (request, reply) {
     //TODO: take token and ID from request and check if its there in db
     console.log(mongojs.ObjectId(request.params.id));
     console.log(request.params.token);
     db.tokens.findOne({entityId:mongojs.ObjectId(request.params.id), tokenValue:request.params.token  },function(err,doc){
        if(!doc){
            console.log(doc);
            return reply(Boom.badRequest('Invalid data',request.payload));
        }
        db.entities.findAndModify({
            query: { _id: mongojs.ObjectId(request.params.id) },
            update: { $set: { "accountActivated": true,
            "contract.status":CONTRACT_STATUS.SENT_SIGNED,
            "contract.dateConfirmed":new Date() }},
            new: true
            }, 
            function (err, doc, lastErrorObject) {
                if(err){
                    return reply(Boom.wrap(err,500, 'Internal MongoDB error'));
                }
                db.tokens.remove({entityId:mongojs.ObjectId(request.params.id), tokenValue:request.params.token},function(err){if(err){console.log('Error deleting tokens',err)}});
                reply(doc);
            });
     });
}

module.exports.handlePatchEntityPassword =function (request, reply) {
    db.entities.findAndModify({
    	query: { _id: mongojs.ObjectId(request.params.id) },
    	update: { $set: { password: request.payload.password}},
    	new: true
	}, function (err, doc, lastErrorObject) {
    	if(err){
            return reply(Boom.wrap(err,500, 'Internal MongoDB error'));
        }
    	reply(doc);
	});
}

module.exports.handleGetContractSigned = function(request,reply){
      db.entities.findAndModify({
      query: { _id: mongojs.ObjectId(request.params.id) },
      update: { $set: { "accountActivated": true,"contract.status":CONTRACT_STATUS.SENT_SIGNED,"contract.dateConfirmed":new Date() }},
      new: true
  }, function (err, doc, lastErrorObject) {
      if(err){
            return reply(Boom.wrap(err,500, 'Internal MongoDB error'));
        }
      reply(doc);
  });
}


module.exports.handleGetEntity = function(request,reply){
       db.entities.findOne(
        {_id:mongojs.ObjectId(request.params.id)},function(err,doc){
        if(!doc)
        {
            console.log(doc);
            return reply(Boom.notFound('Not found','Missing'));
        }
        reply(doc);
        });
}