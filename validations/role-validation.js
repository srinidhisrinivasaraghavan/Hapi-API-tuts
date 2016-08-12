const Joi = require('joi');

module.exports = {
        validate:{
            payload:{
                roleName: Joi.string().max(50).required()
            }
        }
    }