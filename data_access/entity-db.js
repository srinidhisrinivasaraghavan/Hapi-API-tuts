const Entity= require('../models/entity-model').Entity;
const mongoose = require('mongoose');

var entityDB ={
};

entityDB.findAll = function(callback){
	Entity.find(
		{	
		},
		{
        	'__v': 0,
        	'password':0
    	},
    	(err, docs) => {
        return callback(err,docs);
    });
}

entityDB.findOne = function(entityId,callback){
	Entity.findOne(
	{
        _id: mongoose.Types.ObjectId(entityId)
    }, 
    function(err, entity) {
        if(err){
            return callback(err,entity,500);
        }
        if (!entity) {
            return callback(new Error('Missing Record'), entity,400);
        }
        return callback(err, entity);
    });
}

entityDB.save = function(entity,callback){
	entity.save(entity, function(err, savedEntity) {
    	return callback(err,savedEntity);   
    }); 
}

entityDB.Update = function(entityId, setObject, callback){
	 Entity.findOneAndUpdate(
	 	{
	 		_id: mongoose.Types.ObjectId(entityId)
	 	},
        {
         	$set: setObject
        },
        {
            upsert:false,
            new:true
        },
        function(err,savedEntity){
        	if(err){
        		return callback(err,savedEntity,500);
        	}
        	if(!savedEntity){
        		return callback(new Error('Missing Record'),savedEntity,400);
        	}
        	return callback(err,savedEntity);
    	}
    );
}

entityDB.findIfEntityExists = function(email,callback){
    Entity.count({'contract.email': email}, function (err, count){
        if(err){
            return callback(err);
        } 
        console.log(count);
        if(count>0){
            return callback(err,true);
        }
        return callback(err,false);
    });   
}

module.exports = entityDB;