const Joi = require('joi');

module.exports.entityValidationPOST = {
            payload:{
                firstName: Joi.string().max(50).required(),
                lastName: Joi.string().max(50).required(),
                address:  Joi.string().max(200).required(),    
                email: Joi.string().email().required(),
                username: Joi.string().max(50).required(),
                companyName: Joi.required(),
                role: Joi.required(),
                skipContract: Joi.required()
            }
    }

module.exports.entityValidationPUT = {
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


module.exports.passwordValidation = {
        validate:{
            payload:{
                password: Joi.string().max(50).required(),
                token :Joi.required()
            }
        }
    }