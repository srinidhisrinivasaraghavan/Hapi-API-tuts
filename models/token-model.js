// Require libraries and initiate database connection 
var Mongoose = require('mongoose'),
    Schema = Mongoose.Schema;
 
// Define your schema 
var tokenSchema = new Schema({
  tokenValue:{ type: String,  required: true, unique: true },
  entityId:{ type: String,  required: true, unique: true }
});
 
// Instantiate your Model class for the 'entites' collection 
var token =  Mongoose.model('tokens', tokenSchema);
module.exports = {
    Token: token
};