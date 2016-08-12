// Require libraries and initiate database connection 
var databaseConfig= require('../config/db');
var database = require('mongojs-models')(databaseConfig.url);
const Joi = require('joi');
 
// Define your schema 
var schema = new database.Schema({
  companyName:String
});
 
// Instantiate your Model class for the 'entites' collection 
var Company = new database.Model('companies', schema);
module.exports=Company;