const Joi = require('joi');

const taskSchema = Joi.object({
    id: Joi.number().integer().required(),
    title: Joi.string().required(),
    status: Joi.string().valid('done', 'in progress', 'not started').required()
});

const updateTaskSchema = Joi.object({
    id: Joi.number().integer().required(),
    title: Joi.string().optional(),
    status: Joi.string().valid('done', 'in progress', 'not started').optional()
});

module.exports = {
    taskSchema,
    updateTaskSchema
};
