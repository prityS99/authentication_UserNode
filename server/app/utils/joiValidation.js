const Joi = require("joi");

const UserValidation = Joi.object({
  name: Joi.string()
    .min(3)
    .max(30)
    .required()
    .messages({
      'string.min': 'Name must be at least 3 characters long',
      'any.required': 'Name is required'
    }),
  
  email: Joi.string()
    .email({ tlds: { allow: ['com', 'net', 'org', 'in', 'co'] } })
    .lowercase()
    .trim()
    .required()
    .messages({
      'string.email': 'Please enter a valid email address',
      'any.required': 'Email is required'
    }),

  password: Joi.string()
    .min(8)
    .max(100)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters long',
      'string.pattern.base': 'Password must contain uppercase, lowercase, number, and special character',
      'any.required': 'Password is required'
    }),
      about: Joi.string()
    .max(500)
    .allow("")   
});

module.exports = { UserValidation };
