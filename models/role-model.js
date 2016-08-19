// Require libraries and initiate database connection 
var Mongoose = require('mongoose'),
    Schema = Mongoose.Schema;
 
// Define your schema 
var roleSchema = new Schema({
  roleName:{ type: String,  required: true, unique: true }
});
 
// Instantiate your Model class for the 'entites' collection 
var role =  Mongoose.model('roles', roleSchema);
module.exports = {
    Role: role
};