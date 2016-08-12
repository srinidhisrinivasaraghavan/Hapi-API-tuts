const Joi = require('joi');

module.exports = {
        validate:{
            payload:{
                firstName: Joi.string().max(50).required(),
                lastName: Joi.string().max(50).required(),
                address:  Joi.string().max(200).required(),    
                email: Joi.string().email().required(),
                username: Joi.string().max(50).required(),
                companyName: Joi.required(),
                role: Joi.required()
            }
        }
    }