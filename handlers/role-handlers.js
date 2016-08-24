const status = require('hapi-status');
const Boom = require('boom');
const Role = require('../models/role-model').Role;
const DB = require('../data_access/db');

module.exports.handleGetRoles = function (request, reply) {
     DB.findAll(Role,function(err, docs){
        if (err) {
            return reply(Boom.wrap(err));
        }
        status.ok(reply,docs);
    });
}

module.exports.handlePostRoles=function(request,reply){
    var role = new Role(request.payload);
    DB.save(role,function(err, savedRole,code){
        if(err){
            return reply (Boom.wrap(err,code,err.message));
        }
        status.created(reply,savedRole);
    });           
}

module.exports.handleGetIfRoleExists =function(request,reply){
    DB.findIfDocumentExists(Role, {"roleName":request.params.roleName}, function(err, isExist){
        if(err){
            return reply(Boom.wrap(err));
        }
        status.ok(reply,isExist);
    });
}
