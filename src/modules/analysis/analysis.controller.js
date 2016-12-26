'use strict';

import {wrapBody} from '../common/util/helper';
import * as AnalysisService from './analysis.service';
import _ from 'lodash';
import path from 'path';
import fs from 'fs';
import iconv from 'iconv-lite';

//标签接口

export async function analysis(ctx, next) {
    let data = null;
    try {
        let id = ctx.params.id;
        data = await AnalysisService.analysis(id);

        _.each(data.result,(item)=>{
            let tempData = _.sortBy(item.valKVs,(it)=>{
                return -Number(it.percent.replace('%',''));
            });
            item.valKVs = tempData.slice(0,10);
        });

    } catch (ex) {
        return ctx.body = wrapBody(ex);
    }
    ctx.body = wrapBody(null, data);
}

export async function download(ctx, next) {
    try {
        let id = ctx.params.id;
        // let fileName = await AnalysisService.download(id);
        let fileName = await AnalysisService.generatorToZip(id);
        ctx.attachment(path.basename(fileName));
        ctx.body = fs.createReadStream(fileName);




    } catch (ex) {
        return ctx.body = wrapBody(ex);
    }
}

export async function create(ctx, next) {
    let data = null;

    try {
        let body = ctx.request.body;
        data = await AnalysisService.create(body);

    } catch (ex) {
        return ctx.body = wrapBody(ex);
    }
    ctx.body = wrapBody(null, data);

}
