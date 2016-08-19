// Require libraries and initiate database connection 
var Mongoose = require('mongoose'),
    Schema = Mongoose.Schema;
 
// Define your schema 
var companySchema = Schema({
  companyName:{ type: String,  required: true, unique: true }
});
 
// Instantiate your Model class for the 'entites' collection 
var company = Mongoose.model('companies', companySchema);
module.exports = {
    Company: company
};