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
            return reply(Boom.wrap(err,500,err.message));
        }
        status.ok(reply,isExist);
    });
}

module.exports.handlePostCompanies =function(request,reply){
    var company = new Company(request.payload);
    DB.save(company,function(err, savedCompany){
        if(err){
            console.log(err.message);
            return reply (Boom.wrap(err,500,err.message));
        }
        status.created(reply,savedCompany);
    });          
}