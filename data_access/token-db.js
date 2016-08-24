const Token= require('../models/token-model').Token;
const mongoose = require('mongoose');

var tokenDB ={
};

tokenDB.findOneByEntityToken = function(entityId, tokenValue, callback){
	Token.findOne(
    {
        entityId: mongoose.Types.ObjectId(entityId),
        tokenValue: tokenValue
    },
    function(err, token) {
        if(err) {
            return callback(err,token,500);
        }
        if(!token){
            return callback(new Error('Invalid data'),token,400)
        }
        return callback(err,token);
    });
}

tokenDB.removeOneByEntityToken = function(entityId,tokenValue,callback){
    Token.findOneAndRemove(
        {
            entityId:entityId,
            tokenValue:tokenValue
        },
        function(err,token) {
            if(err){
                return callback(err,token,500);
            }
            if(!token){
                return callback(new Error('Invalid data'),token,400);
            }  
            return callback(err,token);  
        });
}

module.exports = tokenDB;