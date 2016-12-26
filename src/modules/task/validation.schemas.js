import Joi from 'joi';
import _ from 'lodash';
import {enums} from '../../config/consts';

export let pages = Joi.object().keys({
	keyword: Joi.string().allow('').default(''),
	pageIndex: Joi.number().integer().min(1).required().default(1),
	pageSize: Joi.number().integer().min(1).max(1000).required().default(10)
});

export let query = Joi.number().integer().required();




export let create = Joi.object().keys({
	"name": Joi.string().min(2).max(100).required(),
	"isPreo": Joi.number().integer().valid(0,1).required(),
	"dimension": Joi.string().allow('').required(),
	"clientType": Joi.number().integer().valid(_.values(enums.ClientType)).required(),
	"clientId": Joi.number().integer().when('clientType', { is: enums.ClientType.user, then: Joi.required()}),
	"period": Joi.number().valid(_.values(enums.PeriodStatus)).integer().required(),
	"expired": Joi.date().when('period', { is: enums.PeriodStatus.immediately, otherwise: Joi.required()}),
	"rules": Joi.object().keys({
		"includes": Joi.array().required(),
		"excludes": Joi.array().required()
	}).required()

});

export let update = Joi.object().keys({
	"name": Joi.string().min(2).max(100).required(),
	"isPreo": Joi.number().integer().valid(0,1).required(),
	"dimension": Joi.string().allow('').required(),
	"clientType": Joi.number().integer().valid(_.values(enums.ClientType)).required(),
	"clientId": Joi.number().integer()
		.when('clientType', { is: enums.ClientType.user, then: Joi.required()})
		.when('clientType', { is: enums.ClientType.yl, then: Joi.default(null)}),
	"period": Joi.number().valid(_.values(enums.PeriodStatus)).integer().required(),
	"expired": Joi.date().when('period', { is: enums.PeriodStatus.immediately, otherwise: Joi.required()}),
	"rules": Joi.object().keys({
		"includes": Joi.array().required(),
		"excludes": Joi.array().required()
	}).required()

});

