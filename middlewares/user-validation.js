const { Joi } = require('celebrate');

const userFullInfoSchema = Joi.object().keys({
  email: Joi.string().required().email().messages({
    'string.empty': 'Please Fill Email Field',
    'any.required': 'Please Fill Email Field',
    'string.email': 'Please Enter A Valid Email Adress',
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Please Fill Password Field',
    'any.required': 'Please Fill Password Field',
  }),
  name: Joi.string().required().min(2).max(30)
    .messages({
      'string.empty': 'Please Fill User Name Field',
      'any.required': 'Please Fill User Name Field',
      'string.min': 'User Name Length Must Be More Then 1',
      'string.max': 'User Name Length Must Not Be More Then 30',
    }),
});

const userLoginSchema = Joi.object().keys({
  email: Joi.string().required().email().messages({
    'string.empty': 'Please Fill Email Field',
    'any.required': 'Please Fill Email Field',
    'string.email': 'Please Enter A Valid Email Adress',
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Please Fill Password Field',
    'any.required': 'Please Fill Password Field',
  }),
});

const userProfilInfoSchema = Joi.object().keys({
  email: Joi.string().required().email().messages({
    'string.empty': 'Please Fill Email Field',
    'any.required': 'Please Fill Email Field',
    'string.email': 'Please Enter A Valid Email Adress',
  }),
  name: Joi.string().required().min(2).max(30)
    .messages({
      'string.empty': 'Please Fill User Name Field',
      'any.required': 'Please Fill User Name Field',
      'string.min': 'User Name Length Must Be More Then 1',
      'string.max': 'User Name Length Must Not Be More Then 30',
    }),
});

module.exports = {
  userFullInfoSchema,
  userLoginSchema,
  userProfilInfoSchema,
};
