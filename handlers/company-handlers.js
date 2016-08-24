const status = require('hapi-status');
const Boom = require('boom');
const mongoose = require('mongoose');
const Company = require('../models/company-model').Company;
const DB = require('../data_access/db');

module.exports.handleGetCompanies = function (request, reply) {
    DB.findAll(Company,function(err, docs){
        if (err) {
            return reply(Boom.wrap(err));
        }
        status.ok(reply,docs);
    });
}

module.exports.handleGetIfCompanyExists =function(request,reply){
    DB.findIfDocumentExists(Company, {"companyName":request.params.companyName}, function(err, isExist){
        if(err){
            return reply(Boom.wrap(err));
        }
        status.ok(reply,isExist);
    });
}

module.exports.handlePostCompanies =function(request,reply){
    var company = new Company(request.payload);
    DB.save(company,function(err, savedCompany,code){
        if(err){
            return reply (Boom.wrap(err,code,err.message ));
        }
        status.created(reply,savedCompany);
    });          
}