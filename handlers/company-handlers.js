const status = require('hapi-status');
const Boom = require('boom');
const mongojs = require('mongojs');
const databaseConfig = require('../config/db');
var Company = require('../models/company-model');

const db= databaseConfig.db;

module.exports.handleGetCompanies = function (request, reply) {
    db.companies.find({},{'_schema':0, '_fields':0},(err, docs) => {
        if (err) {
            return reply(Boom.wrap(err, 'Internal MongoDB error'));
        }
        status.ok(reply,docs);
    });
}


module.exports.handlePostCompanies =function(request,reply){
    var company = new Company(request.payload);
    db.companies.save(company,function(err, savedCompany){
        if(err){
            return reply (Boom.wrap(err,'Internal mongo error'));
        }
        status.created(reply,savedCompany);
    });          
}