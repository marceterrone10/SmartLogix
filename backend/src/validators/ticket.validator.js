import Joi from 'joi';
import mongoose from 'mongoose';

export const ticketSchema = Joi.object({
    title: Joi.string().required().messages({
        'string.empty': 'Title cannot be empty',
        'any.required': 'Title is required'
    }),

    description: Joi.string().required().messages({
        'string.empty': 'Description cannot be empty',
        'any.required': 'Description is required'
    }),

    priority: Joi.string().valid('low', 'medium', 'high').default('low').messages({
        'any.only': 'Priority must be one of the following: low, medium, high',
        'any.default': 'Priority is set to low by default'
    }),

    status: Joi.string().valid('open', 'in-progress', 'resolved', 'cancelled').default('open').messages({
        'any.only': 'Status must be one of the following: open, in-progress, resolved, cancelled',
        'any.default': 'Status is set to open by default'
    }),

    category:  Joi.string().valid('software', 'hardware', 'network', 'other').default('other').messsages({
        'any.only': 'Category must be one of the following: software, hardware, network, other',
        'any.default': 'Category is set to other by default'
    }),

    createdBy: Joi.string().custom((value, helpers) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
            return helpers.error('any.invalid');
        }
        return value;
    }).messages({
        'any.invalid': 'CreatedBy must be a valid ObjectId'
    })
});