// Require libraries and initiate database connection 
var databaseConfig= require('../config/db');
var database = require('mongojs-models')(databaseConfig.url);
 
// Define your schema 
var schema = new database.Schema({
  firstName: String,
  lastName: String,
  address: String,
  email : String,
  username: String,
  companyName: String,
  role :String,
  accountActivated:Boolean,
  contract:{
  	status:String,
  	pdfVersion:String,
  	date:Date
  }
});
 
// Instantiate your Model class for the 'entites' collection 
var Entity = new database.Model('entites', schema);

module.exports=Entity;