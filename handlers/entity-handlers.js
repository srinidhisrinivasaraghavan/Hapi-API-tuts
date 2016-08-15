const Boom = require('boom'); 
const status = require('hapi-status');
const mongojs = require('mongojs');

const databaseConfig = require('../config/db');
var Entity = require('../models/entity-model');
var CONTRACT_STATUS = require('../config/constants').CONTRACT_STATUS;

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
        
        var entity = new Entity(payload);
        entity.accountActivated=payload.skipContract?true:false;
        entity.password=null;
        entity.contract ={
                status:payload.skipContract?CONTRACT_STATUS.SENT_SIGNED:CONTRACT_STATUS.NOT_SENT,
                pdfVersion:'',
                date: new Date(),
            };
        
        db.entities.save(entity,function(err, savedEntity){
            if(err){
                console.log('error while saving entity');
                return reply (Boom.wrap(err,'Internal mongo error'));
            }
            status.created(reply,savedEntity);
        });
        // ASK: pdf version      
    }

module.exports.handlePatchEntitySendEmail =function (request, reply) {
     //TODO: 2. send an email with contract pdf and activation link
          db.entities.findAndModify({
     		query: { _id: mongojs.ObjectId(request.params.id) },
     		update: { 
     					$set:{ 
     							accountActivated: false,
     							contract:{
     								status:CONTRACT_STATUS.SENT_PENDING,
     								date:new Date()
     							} 
     						}
     				},
    		new: true
    		},
    		function (err, doc, lastErrorObject) {
        		if(err){
            	return reply(Boom.wrap(err,500, 'Internal MongoDB error'));
        	}
        	reply(doc);
    	});
    }

module.exports.handlePatchEntityConfirm =function (request, reply) {
     console.log(request.params.token);
     db.entities.findAndModify({
    	query: { _id: mongojs.ObjectId(request.params.id) },
    	update: { $set: { accountActivated: true,
     		contract:{status:CONTRACT_STATUS.SENT_SIGNED,
     		date:new Date()} }},
    	new: true
		}, function (err, doc, lastErrorObject) {
    		if(err){
            	return reply(Boom.wrap(err,500, 'Internal MongoDB error'));
        	}
    		reply(doc);
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

