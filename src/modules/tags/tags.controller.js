'use strict';

import {wrapBody} from '../common/util/helper';
import * as tagsService from './tags.service';
import * as errors from '../common/core/errors';
//标签接口

export async function AllTags(ctx, next) {
    let data = null;
    try {
        data = await tagsService.getAllTags();
    } catch (ex) {
        return ctx.body = wrapBody(ex);
    }
    ctx.body = wrapBody(null, data);
}


export async function valKVs(ctx, next) {
    let data = null;
    try {
        let uid = ctx.params.uid;
        if(!uid){
            throw new errors.ParamsInvalid('uid id required');
        }
        data = await tagsService.valKVs(uid.split(','));
    } catch (ex) {
        return ctx.body = wrapBody(ex);
    }
    ctx.body = wrapBody(null, data);
}
