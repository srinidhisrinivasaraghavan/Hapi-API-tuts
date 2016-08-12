//TODO: Should I move this to separate layer
var entityDb ={

};

entityDb.findAll = function(db,callback){
	db.entities.find({},{'_schema':0, '_fields':0},(err, docs) => {
		return callback(err,docs);
	});
}

entityDb.save = function(db,entity,callback){
	db.entities.save(entity,function(err, savedEntity){
		return callback(err,savedEntity);
    });
}




module.exports = entityDb;