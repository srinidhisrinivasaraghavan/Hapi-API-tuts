const Joi = require('joi');

module.exports = {
            payload:{
                roleName: Joi.string().max(50).required()
            }
    }