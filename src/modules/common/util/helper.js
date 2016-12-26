'use strict'

import * as errors from '../core/errors';
import {
    optionObjs
} from '../../../config/consts';
import config from '../../../config/config';
import request from 'request';
import qs from 'querystring';
import _ from 'lodash';
import md5 from 'md5';
import {
    log
} from '../core/log';
let {
    ResponseStatusOBJ
} = optionObjs;

const privateKey =  config.privateKey ;
const account = config.account;

export function wrapBody(error, data) {
    let status = _.pick(ResponseStatusOBJ['normal'], ['code', 'message']);
    if (error) {
        log.error({
            type: "WebApi",
            err: error
        });
        status = {
            code: error.code ? error.code : 'E300',
            message: error.message
        }
        return {
            status: status
        }
    }
    return {
        data: data,
        status: status
    }
}

export function getJoiErrorMessage(error) {
    return error.details.map(function (n) {
        return n.message
    })
}


export function wrapUrl(url){
    let queryParams = url.split('?');
    let querystring = qs.parse(queryParams[1]);

    if(!_.isObject(querystring)){
        return ;
    }
    querystring.account = account ;
    //加密
    let sign = '';
    let keyList = _.keys(querystring);
    keyList = _.sortBy(keyList);
    // console.log(keyList)
    _.each(keyList,(item)=>{
        if(querystring[item]){
            sign += (item + querystring[item]);
        }
    });
    sign += privateKey;
    console.log(sign)

    querystring.sign = String(md5(sign)).toUpperCase();
    queryParams[1] = qs.stringify(querystring);

    console.log(queryParams.join('?'))

    return queryParams.join('?');
}


const wrapOptions = (url, body, options={})=> {
    //TODO 处理请求，加验证参数
    let apiUrl = wrapUrl(url);

    let defaultOptions = {
        url: apiUrl,
        method: "post",
        json: true,
        body: body,
        timeout: config.apiTimeout,
        forever: true,
        pool: {
            maxSockets: config.poolSize
        },
        time: true
    };
    let req = _.assign({}, defaultOptions, options);

    return req;

};


export function getData(url, body, options) {
    //处理请求，加验证参数
    let req = wrapOptions(url, body, options);


    return new Promise(function (resolve, reject) {
        console.log(req);
        request(req, function (err, res, body) {
            log.info({
                res :res,
                body :body,
                type: "ServerApi",
                err: err,
                code: res ? res.resMsg : 0,
                url: url,
                elapsedTime: res ? res.elapsedTime : 0
            });
            if (err) {
                reject(new errors.ServerApiQueryError(err.message));
            } else {
                if (res.statusCode == 200) {
                    console.log(body)
                    if (body.resCode && body.resCode == "0000") {
                        resolve(body.data);
                        if (!body.data) {
                            console.info(url, body);
                        }
                    } else {
                        reject(new errors.ServerApiQueryError(body.statMsg));
                    }
                } else {
                    reject(new errors.ServerApiQueryError(res.statMsg));
                }
            }

        });
    });
}



