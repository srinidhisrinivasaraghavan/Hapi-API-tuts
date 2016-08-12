// Require libraries and initiate database connection 
var databaseConfig= require('../config/db');
var database = require('mongojs-models')(databaseConfig.url);
 
// Define your schema 
var schema = new database.Schema({
  roleName:String
});
 
// Instantiate your Model class for the 'entites' collection 
var Role = new database.Model('roles', schema);
module.exports=Role;