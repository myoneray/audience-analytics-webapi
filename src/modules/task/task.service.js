import {
    TaskInfo
} from '../common/models';
import _ from 'lodash';
import qs from 'querystring';
import {enums} from '../../config/consts'
import config from '../../config/config'
import {getData} from '../common/util/helper';

const prefix = config.serverApiPath;

//数据端人群圈定新建
export async function serverCreateCrowd(params) {

    let query = _.pick(params, ['period', 'isPreo']);
    let url = prefix + `/crowd/delineation?${qs.stringify(query)}`;
    let body = params['rules'];
    console.log(body);
    let data = await getData(url, body);
    return data;
}

//数据端人群圈定更新
export async function serverUpdateCrowd(params) {

    let query = _.pick(params, ['period', 'isPreo']);
    query.taskId = params.crowdId;
    let url = prefix + `/crowd/update?${qs.stringify(query)}`;
    let body = params['rules'];
    console.log(body);
    let data = await getData(url, body);
    return data;
}

//数据端人群圈定删除
export async function serverDeleteCrowd(id) {

    let query = {taskId: id};
    let url = prefix + `/crowd/delete?${qs.stringify(query)}`;
    let data = await getData(url, {}, {method: 'GET'});
    return data;
}


//数据端人群画像分析接口新建
export async function serverCreateAnalysis(params) {

    let query = _.pick(params, ['period', 'taskId']);
    let dimesionArr = params.dimension.split(',');
    let taskId = [];
    for (let i = 0; i < dimesionArr.length; i++) {
        let dimensionItem = dimesionArr[i];
        let analysisQuery = _.assign(query, {dimension: dimensionItem});
        let url = prefix + `/nature/analysis?${qs.stringify(analysisQuery)}`;
        let body = params['rules'];
        let data = await getData(url, body ,{});
        if(data && data.taskId){
            taskId.push(data.taskId);
        }
    }

    let taskIds = taskId.join(',');
    return taskIds;

}

//数据端人群画像分析接口更新
export async function serverUpdateAnalysis(params) {

    let query = _.pick(params, ['period']);
    let dimesionArr = params.dimension.split(',');

    let taskArr = params.taskId.split(',');
    let crowdId = params.crowdId;

    for (let i = 0; i < dimesionArr.length; i++) {

        let dimensionItem = dimesionArr[i];
        let index = i;
        if (taskArr[index]) {
            let analysisQuery = _.assign(query, {dimension: dimensionItem,taskId : taskArr[index]});
            let url = prefix + `/nature/update?${qs.stringify(analysisQuery)}`;
            let body = params['rules'];
            await getData(url, body,{});
        } else {
            let analysisCreateQuery = _.assign(query, {dimension: dimensionItem, taskId: crowdId});
            let url = prefix + `/nature/analysis?${qs.stringify(analysisCreateQuery)}`;
            let body = params['rules'];
            let data = await getData(url, body,{});
            taskArr.push(data.taskId);
        }

    }

    console.log(taskArr)

    return taskArr.slice(0, dimesionArr.length).join(',');

}

//数据端人群画像分析接口删除
export async function serverDeleteAnalysis(ids) {
    let idArr = ids.split(',');
    for (let i = 0; i < idArr.length; i++) {
        let idItem = idArr[i];
        let query = {
            taskId: idItem
        };
        let url = prefix + `/nature/delete?${qs.stringify(query)}`;
        await getData(url, {}, {method: 'GET'});
    }

}


export async function create(body) {
    //新建表
    // await TaskInfo.sync();
    let data = await TaskInfo.create(body);

    return data;

}

export async function test(body) {

    let query = {taskId : '108,107'};
    let url = prefix + `/task/query?${qs.stringify(query)}`;

    console.log(body);
    let data = await getData(url, {}, {method: 'GET'});
    return data;

}

export async function query(id) {
    let where = {
        id: id,
        isDeleted: enums.Delete.nodeleted
    };

    let data = await TaskInfo.findOne({
        where,
        attributes: ['id', 'crowdId', 'taskId', 'name', 'clientType', 'clientId', 'period', 'expired', 'status', 'createdAt', 'updatedAt', 'dimension', 'rules']
    });

    return data;
}

export async function update(id, body) {
    let info = _.pick(body, ['name','crowdId', 'taskId','clientType', 'clientId', 'period', 'expired', 'isPreo', 'dimension', 'rules', 'status']);
    if (!info.expired) info.expired = null;
    let data = await TaskInfo.update(info, {
        where: {
            id: id
        }
    });
    return data;
}

export async function remove(id) {

    let data = await TaskInfo.update({
        isDeleted: enums.Delete.deleted
    }, {
        where: {
            id: id
        }
    });

    return data;
}


export async function pages(query) {
    let limit = Number(query.pageSize);
    let offset = query.pageIndex ? ((query.pageIndex - 1) * limit) : 0;
    let keyword = query.keyword;
    let where = {
        isDeleted: enums.Delete.nodeleted
    };
    if (keyword) {
        _.assign(where, {
            $or: {
                id: {
                    $like: '%' + keyword + '%'
                },
                name: {
                    $like: '%' + keyword + '%'
                }
            }
        });
    }
    let condition = {
        where,
        offset,
        limit,
        order: 'updatedAt DESC',
        attributes: ['id', 'name', 'status', 'period', 'expired', 'status', 'existAnalysisInfo', 'createdAt', 'updatedAt'],
        raw: true
    };
    let total = await TaskInfo.count({where});
    let list = await TaskInfo.findAll(condition);
    return {
        total,
        list,
        pageSize: limit,
        pageIndex: offset
    };

}