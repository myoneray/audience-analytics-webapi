'use strict'
import Joi from 'joi';
import * as schemas from './validation.schemas';
import {wrapBody as wrap, getJoiErrorMessage} from '../common/util/helper';
import * as errors  from '../common/core/errors';

export async function pages(ctx, next){ 
	let schema = schemas.pages;
	try{
		const result = Joi.validate(ctx.request.query, schema);
		if(result.error){
			throw new errors.ParamsInvalid(getJoiErrorMessage(result.error));
		}
		ctx.state.query = result.value; //?是否有性能问题，重新赋值时基于joi 转化过数据考虑
		await next();
	}catch(ex){
		return ctx.body = wrap(ex);
	}
}
export async function query(ctx, next){
	let schema = schemas.query;
	try{
		const result = Joi.validate(ctx.params.id , schema);
		if(result.error){
			throw new errors.ParamsInvalid(getJoiErrorMessage(result.error));
		}
		ctx.state.query = result.value; //?是否有性能问题，重新赋值时基于joi 转化过数据考虑
		await next();
	}catch(ex){
		return ctx.body = wrap(ex);
	}
}

export async function create(ctx, next){
	let schema = schemas.create;
	try{
		const result = Joi.validate(ctx.request.body, schema);
		if(result.error){
			throw new errors.ParamsInvalid(getJoiErrorMessage(result.error));
		}
		ctx.request.body = result.value; //to do test
		await next();
	}catch(ex){
		return ctx.body = wrap(ex);
	}
}

export async function update(ctx, next){
	let schema = schemas.update;
	try{
		const result = Joi.validate(ctx.request.body, schema);
		if(result.error){
			throw new errors.ParamsInvalid(getJoiErrorMessage(result.error));
		}
		ctx.request.body = result.value; //to do test
		await next();
	}catch(ex){
		return ctx.body = wrap(ex);
	}
}
