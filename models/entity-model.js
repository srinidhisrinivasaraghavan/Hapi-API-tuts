var Mongoose = require('mongoose'),
    Schema = Mongoose.Schema;

var contractSchema = new Schema({
    firstName: { type: String,  required: true },
    lastName: { type: String, required: true },
    email :{ type: String, required: true, unique: true} ,
    companyName:{ type: String, required: true } ,
    status:{ type: String, required: true } ,
    pdfVersion:{ type: String } ,
    dateSent: { type: String  },
    dateConfirmed :{ type: String }
});

var entitySchema = new Schema({
    address: { type: String,  required: true },
    password: { type: String,  select: false  },
    username :{ type: String, required: true } ,
    role:{ type: String, required: true } ,
    accountActivated:{ type: Boolean, required: true } ,
    skipContract:{ type: Boolean, required: true } ,
    dateCreated: { type: String, required: true },
    datePasswordCreated :{type: String, select: false},
    contract : contractSchema
});

var entity = Mongoose.model('entities', entitySchema);
var contract = Mongoose.model('contract', contractSchema);
module.exports = {
    Entity: entity,
    Contract : contract
};