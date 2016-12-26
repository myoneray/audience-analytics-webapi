'use strict';

import {wrapBody} from '../common/util/helper';
import * as errors from '../common/core/errors';
import * as taskService from './task.service';
import {enums} from '../../config/consts'
import _ from 'lodash';
//标签接口

export async function pages(ctx, next) {
    let data = null;
    try {
        let query = ctx.request.query;
        data = await taskService.pages(query);
    } catch (ex) {
        return ctx.body = wrapBody(ex);
    }
    ctx.body = wrapBody(null, data);
}

export async function test(ctx, next) {
    let data = null;
    try {
        data = await taskService.test();
    } catch (ex) {
        return ctx.body = wrapBody(ex);
    }
    ctx.body = wrapBody(null, data);
}



export async function create(ctx, next) {
    let data = null;
    try {
        let body = ctx.request.body;
//新建人群任务

        let serverCrowdData = await taskService.serverCreateCrowd(body);

        if(!serverCrowdData.taskId){
            throw new errors.ServerApiQueryError('serverApi create Crowd error')
        }

//把数据端创建成功的taskId临时存储，之后会重新改名为crowd
        body.taskId = serverCrowdData.taskId;

        body = _.pick(body,['name','taskId','period','expired','isPreo','dimension','rules','status']);

//新建多条分析任务
        let serverAnalysisIds = await taskService.serverCreateAnalysis(body);

        if(!serverAnalysisIds){
            throw new errors.ServerApiQueryError('serverApi serverAnalysisIds create Task error')
        }
//重新赋值taskId,crowdId
        body.taskId = serverAnalysisIds;
        body.crowdId = serverCrowdData.taskId;

        data = await taskService.create(body);

    } catch (ex) {
        return ctx.body = wrapBody(ex);
    }
    ctx.body = wrapBody(null, data);
}

export async function query(ctx, next) {
    let data = null;
    try {
        let id = ctx.params.id;
        data = await taskService.query(id);
    } catch (ex) {
        return ctx.body = wrapBody(ex);
    }
    ctx.body = wrapBody(null, data);
}

export async function update(ctx, next) {
    let data = null;
    try {
        let id = ctx.params.id;
        let body = ctx.request.body;

        let taskRecord = await taskService.query(ctx.params.id);

        body = _.assign(_.pick(taskRecord,['taskId','crowdId']),
            _.pick(body,['name','clientType','clientId','period','expired','isPreo','dimension','rules','status']));


        if(!taskRecord || !taskRecord.taskId || !taskRecord.crowdId){
            throw new errors.ParamsInvalid('taskId or crowdId exist null')
        }
//更新人群接口
        await taskService.serverUpdateCrowd(body);
////更新分析接口
        let serverAnalysisIds =  await taskService.serverUpdateAnalysis(body);

        body.taskId = serverAnalysisIds;
//对于已经完成的任务，如果更新将任务状态暂时更新为待执行状态，之后每隔15分钟同步状态
        body.status = enums.TaskStatus.loading;
        data = await taskService.update(id,body);

    } catch (ex) {
        return ctx.body = wrapBody(ex);
    }
    ctx.body = wrapBody(null, data);
}


export async function remove(ctx, next) {
    let data = null;
    try {
        let id = ctx.params.id;
        let taskRecord = await taskService.query(id);


        if(!taskRecord || !taskRecord.taskId || !taskRecord.crowdId){
            throw new errors.ParamsInvalid('taskId or crowdId exist null')
        }

//删除分析接口

/*
        await taskService.serverDeleteAnalysis(taskRecord.taskId);

//删除人群接口
        await taskService.serverDeleteCrowd(taskRecord.crowdId);*/

        data = await taskService.remove(taskRecord.id);


    } catch (ex) {
        return ctx.body = wrapBody(ex);
    }
    ctx.body = wrapBody(null, data);
}
