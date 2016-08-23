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
    	return callback(err,savedObj);   
    }); 
}

DB.findIfDocumentExists = function(collection, criteria ,callback){
    collection.count(criteria, function (err, count){
        if(err){
            return callback(err);
        }
        if(count>0){
            return callback(err,true);
        }
        return callback(err,false);
    });   
}

DB.findOne = function(collection, id, callback){
    collection.findOne(
    {
        _id: mongoose.Types.ObjectId(id)
    }, 
    function(err, doc) {
        if(err){
            return callback(err,doc,500);
        }
        if (!doc) {
            return callback(new Error('Missing Record'), doc,400);
        }
        return callback(err, doc);
    });
}

DB.Update = function(collection, id, setObject, callback){
     collection.findOneAndUpdate(
        {
            _id: mongoose.Types.ObjectId(id)
        },
        {
            $set: setObject
        },
        {
            upsert:false,
            new:true
        },
        function(err,savedDoc){
            if(err){
                return callback(err,savedDoc,500);
            }
            if(!savedDoc){
                return callback(new Error('Missing Record'),savedDoc,400);
            }
            return callback(err,savedDoc);
        }
    );
}

module.exports = DB;