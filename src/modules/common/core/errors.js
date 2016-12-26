'use strict';
import util from 'util';

export let defineError = function(name, code){
	let SelfError = function(message){
		Error.captureStackTrace(this, this.constructor);
		this.name = name;
		this.code = code;
		this.message = message;
	};
	util.inherits(SelfError, Error);
	return SelfError;
};

//E300系列 system错误
//301没有定义的错误 预留
export let ParamsInvalid = defineError('ParamsInvalid', 'E302');
export let IdInvalid = defineError('Id Invalid', 'E310');

//E400系列 report错误
export let ServerApiQueryError = defineError('ServerApiQueryError', 'E401');
/*
export let ReportApiServerError = defineError('ReportApiServerError', 'E402');
export let ReportServerNetError = defineError('ReportServerNetError', 'E403');*/
