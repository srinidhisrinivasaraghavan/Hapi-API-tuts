const Joi = require('joi');

module.exports = {
            payload:{
                companyName: Joi.string().max(50).required()
            }
    }