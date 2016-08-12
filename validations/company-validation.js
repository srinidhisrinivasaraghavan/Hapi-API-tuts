const Joi = require('joi');

module.exports = {
        validate:{
            payload:{
                companyName: Joi.string().max(50).required()
            }
        }
    }