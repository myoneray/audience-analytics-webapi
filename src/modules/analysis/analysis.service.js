import {
    AnalysisInfo, TaskInfo, ValKVsInfo, TagsInfo
} from '../common/models';
import _ from 'lodash';
import iconv from 'iconv-lite';
import moment from 'moment';
var JSZip = require("jszip");

import converterToCsv from 'json-2-csv';
import {enums} from '../../config/consts'
import config from '../../config/config'
import path from 'path';
import fs from 'fs';
import qs from 'querystring';
import {getData} from '../common/util/helper';
const prefix = config.serverApiPath;

//数据端人群画像分析数据result返回
export async function serverGetAnalysis(id) {
    let taskData = await TaskInfo.findOne({
        where: {
            id
        }
    });
    let query = {
        taskId: taskData.taskId
    };
    let url = prefix + `/task/query?${qs.stringify(query)}`;

    console.log(body);
    let data = await getData(url, body, {method: 'GET'});
    return data;
}

const getTaskResultById = async(id)=> {

    let analysisData = await AnalysisInfo.findOne({
        where: {
            taskId: id,
            isDeleted: enums.Delete.nodeleted
        }
    });
    let taskInfo = await TaskInfo.findOne({
        where: {
            id,
            isDeleted: enums.Delete.nodeleted
        }
    });
    let finalResult = {
        result : []
    };

    if (analysisData && analysisData.result && taskInfo && analysisData.result.result) {
        let uids = [];
        
        analysisData.result.result.forEach( item =>{
            uids.push(item['uid']);
        });

        let uidsKVsMap = await getValKVsByUid(uids);
//此处替换key到value
        analysisData.result.result.forEach((item)=>{
            item.valKVs.forEach((itemKV)=>{
                itemKV.value = _.map(itemKV.key.split(';'),(keyItem)=>uidsKVsMap[keyItem]).join(';')
            });
            finalResult.result.push(item);
        });

        finalResult.result.forEach((item)=>{
            let tempData = _.sortBy(item.valKVs,(it)=>{
                return -Number(it.percent.replace('%',''));
            });
            item.valKVs = tempData;
        });

        _.assign(finalResult,{
            id : taskInfo.id,
            recordUpdatedAt : taskInfo.recordUpdatedAt,
            rules : taskInfo.rules
        });


    }

    return finalResult;
};

const getNameByUid = async(uid)=> {
    let data = await TagsInfo.findOne({
        attributions: ['name'],
        where: {
            uid
        }
    });
    return data.name;
}
const getValKVsByUid = async (uids)=> {
    let data = await ValKVsInfo.findAll({
        attributions: ['key', 'value'],
        where: {
            tag_uid: {
                $in : uids
            }
        }
    });
    let map = {};
    if(data){
        data.forEach(item=>{
            map[item.key] = item.value;
        });
    }
    return map;
}

const getTaskRulesAliasById = async(id)=> {
    let taskRecord = await TaskInfo.findOne({
        attributions: ['rules'],
        where: {
            id,
            isDeleted: enums.Delete.nodeleted
        }
    });
    if (!taskRecord) {
        return '';
    }
    let rules = taskRecord.rules;
    let alias = '';
    if (rules.includes.length > 0) {
        alias +=  ' 允许 ';

        for (let i = 0; i < rules.includes.length; i++) {

            let includesItem = rules.includes[i];
            if(i>0){
                alias += ' 或 ';
            }
            for (let j = 0; j < includesItem.length; j++) {
                let includesAndItem = includesItem[j];
                if(j>0){
                    alias += ' 且 ';
                }
                let keyAlias = await getNameByUid(includesAndItem.uid);
                alias +=  `(${keyAlias}: ${includesAndItem.rule})`
            }
        }
    }

    if (rules.excludes.length > 0) {
        alias +=  ' 排除 ';
        for (let m = 0; m < rules.excludes.length; m++) {
            let excludesItem = rules.excludes[m];
            if(m>0){
                alias += ' 或 ';
            }
            for (let n = 0; n < excludesItem.length; n++) {
                let excludesAndItem = excludesItem[n];
                if(n>0){
                    alias += ' 且 ';
                }
                let keyAlias = await getNameByUid(excludesAndItem.uid);

                alias +=`(${keyAlias}: ${excludesAndItem.rule})`
            }
        }
    }
    return alias.replace(/,/g,';');


};


export async function analysis(id) {
    //新建表
    // await CrowdInfo.sync();
    // let taskId = await getTaskById(id);

    let analysisData = await getTaskResultById(id);

    return analysisData;
}

export async function download(id) {
    //新建表
    // await CrowdInfo.sync();

    let fileName = path.join(__dirname, `../../../files/analysis/${id}.zip`);

    if (!fs.existsSync(fileName)) {
        fs.mkdirSync(fileName);
    }

    return fileName;
}
//生成csv流

export function generatorToCSV(documents) {
    return new Promise((resolve, reject)=> {
        converterToCsv.json2csv(documents, (err, csv)=> {
            if (err) reject(err);
            resolve(csv);
        }, {
            emptyFieldValue: '',
            prependHeader: false,
            checkSchemaDifferences: false
        })
    });
}

//生成分析报告的csv

export async function generatorToZip(id) {
    var zip = new JSZip();

    let analysisData = await analysis(id);
    let rulesAlias = await getTaskRulesAliasById(id);
    let analysisResultData = analysisData.result;
    for (let i = 0; i < analysisResultData.length; i++) {

        let resultItem = analysisResultData[i];
        let resultArr = [];

        resultArr.push([`任务ID:${resultItem.taskId}`], [`人群规则:${rulesAlias}`],
            [`更新日期:${moment(analysisData.recordUpdatedAt).format('YYYY-MM-DD')}`], [`${resultItem.name}`, '占比']);

        resultItem.valKVs.forEach(item=> {
            resultArr.push([item.value, item.percent])
        });

        let tempCSV = await generatorToCSV(resultArr);

        zip.file(`${resultItem.name}.csv`, iconv.encode(tempCSV, 'gb2312'));

    }


    await new Promise((resolve)=> {

        zip.generateNodeStream({type: 'nodebuffer', streamFiles: true})
            .pipe(fs.createWriteStream(path.join(__dirname, `../../../files/analysis/${id}.zip`)))
            .on('finish', function () {
                resolve()
            })

    });

    return path.join(__dirname, `../../../files/analysis/${id}.zip`)

}


export async function create(body) {
    AnalysisInfo.sync();
    let data = await AnalysisInfo.create(body);
    return data;
}



