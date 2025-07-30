import Joi from 'joi';

export const userRegisterSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Email must be a valid email address',
        'any.required': 'Email is required'
    }),

    password: Joi.string().pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/).required().messages({
        'string.pattern.base': 'Password must be at least 8 characters long and contain at least one letter and one number',
        'string.empty': 'Password cannot be empty',
        'any.required': 'Password is required'
    }),

    role: Joi.string().valid('admin', 'tecnico', 'cliente').default('cliente').messages({
        'any.only': 'Role must be one of the following: admin, tecnico, cliente',
        'any.default': 'Role is set to cliente by default'
    })
});

export const userLoginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Email must be a valid email address',
        'any.required': 'Email is required'
    }),

    password: Joi.string().required().messages({
        'string.empty': 'Password cannot be empty',
        'any.required': 'Password is required'
    })
});

