import Joi from 'joi';

export let pages = Joi.object().keys({
	pageIndex: Joi.number().integer().min(1).required(),
	pageSize: Joi.number().integer().min(5).max(50).required(),
	keyword: Joi.string().min(2).max(30)
});