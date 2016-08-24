const mongoose = require('mongoose');

var DB ={
};

DB.findAll = function(collection,callback){
	collection.find(
		{	
		},
		{
        	'__v': 0
    	},
    	(err, docs) => {
        return callback(err,docs);
    });
}

DB.save = function(obj,callback){
	obj.save(obj, function(err, savedObj) {
        if(err && err.code===11000){
           return callback(new Error('Duplicate content'),savedObj,400); 
        }
        else if(err){
            callback(err,savedObj,500);
        }
    	return callback(err,savedObj);   
    }); 
}

DB.findIfDocumentExists = function(collection, criteria ,callback){
    collection.findOne(criteria, function(err, doc) {
        if(err){
            return callback(err);
        }
        if (!doc) {
            return callback(err,false);
        }
        return callback(err,true,doc._id);
    });  
}

DB.findOne = function(collection, id, callback){
    collection.findOne(
    {
        _id: mongoose.Types.ObjectId(id)
    }, 
    function(err, doc) {
        if(err){
            return callback(err, doc, 500);
        }
        if (!doc) {
            return callback(new Error('Missing Record'), doc, 404);
        }
        return callback(err, doc);
    });
}

DB.Update = function(collection, id, setObject, callback){
     collection.findOneAndUpdate(
        {
            _id: mongoose.Types.ObjectId(id)
        },
        
         setObject
        ,
        {
            upsert:false,
            new:true
        },
        function(err,savedDoc){
            if(err){
                return callback(err,savedDoc,500);
            }
            if(!savedDoc){
                return callback(new Error('Missing Record'),savedDoc,404);
            }
            return callback(err,savedDoc);
        }
    );
}

module.exports = DB;