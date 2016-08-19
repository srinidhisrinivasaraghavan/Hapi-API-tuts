const status = require('hapi-status');
const Boom = require('boom');
const mongoose = require('mongoose');
const Company = require('../models/company-model').Company;

module.exports.handleGetCompanies = function (request, reply) {
    Company.find({},{'_schema':0, '_fields':0},(err, docs) => {
        if (err) {
            return reply(Boom.wrap(err, 'Internal MongoDB error'));
        }
        status.ok(reply,docs);
    });
}

module.exports.handlePostCompanies =function(request,reply){
    var company = new Company(request.payload);
    company.save(function(err, savedCompany){
        if(err){
            return reply (Boom.wrap(err,'Internal mongo error'));
        }
        status.created(reply,savedCompany);
    });          
}