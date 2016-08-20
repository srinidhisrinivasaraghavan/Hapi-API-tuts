const Company= require('../models/company-model').Company;
const mongoose = require('mongoose');

var CompanyDB ={
};

CompanyDB.findAll = function(callback){
	Company.find(
		{	
		},
		{
        	'__v': 0
    	},
    	(err, companies) => {
        return callback(err,companies);
    });
}

CompanyDB.save = function(company,callback){
	company.save(company, function(err, savedCompany) {
    	return callback(err,savedCompany);   
    }); 
}

module.exports = CompanyDB;