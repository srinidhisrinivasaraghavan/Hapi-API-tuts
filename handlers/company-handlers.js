const status = require('hapi-status');
const Boom = require('boom');
const mongoose = require('mongoose');
const Company = require('../models/company-model').Company;
const companyDB = require('../data_access/company-db');

module.exports.handleGetCompanies = function (request, reply) {
    companyDB.findAll(function(err, docs){
        if (err) {
            return reply(Boom.wrap(err));
        }
        status.ok(reply,docs);
    });
}

module.exports.handlePostCompanies =function(request,reply){
    var company = new Company(request.payload);
    companyDB.save(company,function(err, savedCompany){
        if(err){
            return reply (Boom.wrap(err,'Internal mongo error'));
        }
        status.created(reply,savedCompany);
    });          
}