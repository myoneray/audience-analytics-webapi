'use strict';

import {wrapBody} from '../common/util/helper';
import * as CrowdService from './crowd.service';
import _ from 'lodash';
import config from '../../config/config';
import path from 'path';
import fs from 'fs';
import {enums} from '../../config/consts';
import moment from 'moment';
// import {Chance} from 'chance';
import  * as AppService from '../app/app.service'
var async = require("async");


//标签接口

export async function pages(ctx, next) {
    let data = null;
    try {
        let query = ctx.request.query;
        data = await CrowdService.pages(query);

    } catch (ex) {
        return ctx.body = wrapBody(ex);
    }
    ctx.body = wrapBody(null, data);
}

export async function list(ctx, next) {
    let data = null;
    try {
        data = await CrowdService.list();

    } catch (ex) {
        return ctx.body = wrapBody(ex);
    }
    ctx.body = wrapBody(null, data);
}
//test
export async function test(ctx, next) {
    await CrowdService.validate();
}

export async function upload(ctx, next) {
    let data = null;
    try {
        let file = ctx.request.body.files.file;
        let baseName = path.basename(file.name, '.csv');
        let body = {
            name: baseName
        };

        console.log(ctx.request.body.files.file);

        // body = _.pick(body,['name','lineCount','status','createdAt','updatedAt']);

        console.log(file.path + '.csv');

        //存储到本地csv
        fs.renameSync(file.path, file.path + '.csv');

        //验证csv的合法性
        let validRes = await CrowdService.validate(file.path + '.csv');

        if (validRes) {
            body.status = validRes.validate ? enums.UploadStatus.success : enums.UploadStatus.failure;
            body.lineCount = validRes.lineCount;
        }

        //console.log('test>>',validRes.key);

        //创建一条上传记录 无论合法与否
        data = await CrowdService.create(body);

        let fileName = data.id + path.extname(file.name);
        let filePath = path.join(config.validateDir, fileName);

        //把csv的结果存储到validate目录下
        if (!validRes.validate) {
            fs.writeFileSync(filePath, validRes.result);
        }

        //应用端注册
        let csvData = validRes.data;
        let appResultMap = await AppService.appRegister(csvData);
        if (!_.isEmpty(appResultMap)) {
            //说明标签没有注册
            await  AppService.createNewDataCsv(appResultMap, csvData,filePath);
        }
        /*
         let day = moment().format("YYYY-MM-DD");
         let dayPath = path.join(config.validateDir, day);
         if (!fs.existsSync(dayPath)) {
         fs.mkdirSync(dayPath);
         }
         let filePath = path.join(dayPath, fileName);
         fs.renameSync(file.path, filePath);
         */

    }
    catch
        (ex) {
        return ctx.body = wrapBody(ex);
    }

    ctx.body = wrapBody(null, data);
}


export async function remove(ctx, next) {
    let data = null;
    try {
        let id = ctx.params.id;
        data = await CrowdService.remove(id);
    } catch (ex) {
        return ctx.body = wrapBody(ex);
    }
    ctx.body = wrapBody(null, data);
}


export async function downloadTemplate(ctx, next) {
    try {
        let fileName = await CrowdService.downloadTemplate();
        ctx.attachment(path.basename(fileName));
        ctx.body = fs.createReadStream(fileName);
    } catch (ex) {
        return ctx.body = wrapBody(ex);
    }
}

export async function downloadValidate(ctx, next) {
    try {
        let fileName = await CrowdService.downloadValidate(ctx.params.id);
        ctx.attachment(path.basename(fileName));
        ctx.body = fs.createReadStream(fileName);
    } catch (ex) {
        return ctx.body = wrapBody(ex);
    }
}


