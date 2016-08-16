// Require libraries and initiate database connection 
var databaseConfig= require('../config/db');
var database = require('mongojs-models')(databaseConfig.url);
 
// Define your schema 
var schema = new database.Schema({
  tokenValue:String,
  entityId:String
});
 
// Instantiate your Model class for the 'entites' collection 
var Token = new database.Model('tokens', schema);
module.exports=Token;