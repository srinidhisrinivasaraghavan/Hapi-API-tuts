const status = require('hapi-status');
const Boom = require('boom');
const Role = require('../models/role-model').Role;

module.exports.handleGetRoles = function (request, reply) {
    Role.find({},{'_schema':0, '_fields':0},(err, docs) => {
        if (err) {
            return reply(Boom.wrap(err, 'Internal MongoDB error'));
        }
        status.ok(reply,docs);
    });
}

module.exports.handlePostRoles=function(request,reply){
    var role = new Role(request.payload);
    role.save(function(err, savedRole){
        if(err){
            return reply (Boom.wrap(err,'Internal mongo error'));
        }
        status.created(reply,savedRole);
    });           
}