import {
	enums,
	options,
	optionValKeyMaps,
	optionKeyValMaps,
	optionValNameMaps
} from '../../config/consts';
import {wrapBody as wrap} from '../common/util/helper';

export function getEnums(ctx, next){
	let data = null;
	let error = null;
	try{
		data = enums;
	}catch(ex){
		return ctx.body = wrap(ex);
	}
	ctx.body = wrap(error, data);
}

export function getOptions(ctx, next){
	let data = null;
	let error = null;
	try{
		data = options;
	}catch(ex){
		return ctx.body = wrap(ex);
	}
	ctx.body = wrap(error, data);
}

export function getKVMap(ctx, next){
	let data = null;
	let error = null;
	try{
		data = optionKeyValMaps;
	}catch(ex){
		return ctx.body = wrap(ex);
	}
	ctx.body = wrap(error, data);
}

export function getVKMap(ctx, next){
	let data = null;
	let error = null;
	try{
		data = optionValKeyMaps;
	}catch(ex){
		return ctx.body = wrap(ex);
	}
	ctx.body = wrap(error, data);
}

export function getVNMap(ctx, next){
	let data = null;
	let error = null;
	try{
		data = optionValNameMaps;
	}catch(ex){
		return ctx.body = wrap(ex);
	}
	ctx.body = wrap(error, data);
}