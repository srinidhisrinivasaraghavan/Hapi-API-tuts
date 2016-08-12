const status = require('hapi-status');
const Boom = require('boom');
const databaseConfig = require('../config/db');
var Role = require('../models/role-model');

const db= databaseConfig.db;

module.exports.handleGetRoles = function (request, reply) {
    db.roles.find({},{'_schema':0, '_fields':0},(err, docs) => {
        if (err) {
            return reply(Boom.wrap(err, 'Internal MongoDB error'));
        }
        status.ok(reply,docs);
    });
}


module.exports.handlePostRoles=function(request,reply){
    var role = new Role(request.payload);
    db.roles.save(role,function(err, savedRole){
        if(err){
            return reply (Boom.wrap(err,'Internal mongo error'));
        }
        status.created(reply,savedRole);
    });           
}