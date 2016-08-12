// Require libraries and initiate database connection 
var databaseConfig= require('../config/db');
var database = require('mongojs-models')(databaseConfig.url);
const Joi = require('joi');
 
// Define your schema 
var schema = new database.Schema({
  firstName: String,
  lastName: String,
  address: String,
  email : String,
  username: String,
  companyName: String,
  role :String,            
  contract:{
  	status:String,
  	pdfVersion:String,
  	date:Date
  },
  accountActivated:Boolean
});
 
// Instantiate your Model class for the 'entites' collection 
var Entity = new database.Model('entites', schema);
module.exports=Entity;