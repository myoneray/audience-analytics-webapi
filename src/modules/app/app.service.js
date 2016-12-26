import {
    AppInfo
} from '../common/models';
import _ from 'lodash';
import config from '../../config/config';
import qs from 'querystring';
import {getData} from '../common/util/helper';
const prefix = config.serverApiPath;
var async = require('async');
var converterToCsv = require('json-2-csv');
import iconv from 'iconv-lite';
import fs from 'fs';


/**
 * 根据标签值查询
 * @param tagValue
 */
export async function getBytagValue(tagValue) {
    let AppData = await AppInfo.findOne({
        where: {
            tagValue
        }
    });
    return AppData;
}

/**
 * 存储标签
 */

export async function create(body) {
    //AppInfo.async();
    let data = await AppInfo.create(body);
    return data;
}

export async function findOne(id) {
    let data = await AppInfo.findOne({
        where: {
            id
        }
    });
    return data;
}
/**
 * 标签注册
 * */
export async function appRegister(csvData) {
    let appIdArr = [];
    for (let i = 0; i < csvData.length; i++) {
        let item = csvData[i];
        let keys = _.keys(item);
        let values = _.values(item);
        for (let j = 0; j < keys.length; j++) {
            let key = keys[j];
            let value = values[j];
            if (_.includes(key, 'tag')) {
                let appData = await getBytagValue(value);
                if (_.isEmpty(appData)) {
                    let endValue = _.split(key, '_');
                    let tagKey = endValue[0]; //标签标识
                    let tagType = endValue[2]; //标签类型(字符串/数值)
                    let tagValueType = endValue[3]; //标签值类型(单值/多值)
                    let tagValue = value; //标签值*/
                    let tagData = {
                        tagKey: tagKey,
                        tagType: parseInt(tagType),
                        tagValueType: parseInt(tagValueType),
                        tagValue: tagValue
                    };
                    let result = await create(tagData);
                    appIdArr.push(result.id);
                } else {
                    //已经注册了数据
                    appIdArr.push(appData.id);
                }
            }
        }
    }

    if (!_.isEmpty(appIdArr)) {
        let appDataMap = new Map();
        for (let index = 0; index < appIdArr.length; index++) {
            let appData = await findOne(appIdArr[index])
            if (!appData.uid) {
                //请求注册接口
                let params = {
                    name: appData.tagValue,
                    valueType: appData.tagValueType
                }
                let data = await clientTagRegister(params, appData.tagKey);
                // 修改数据库
                if (_.eq(data.statCode, '00000')) {
                    let dataUid = data.data.uid;
                    //根据id修改数据库
                    let id = appData.id;
                    let resultData = await addUid(dataUid, id);
                    console.log('resultData', resultData);
                    let tagKey = appData.tagKey;
                    let tagType = appData.tagType; //标签类型(字符串/数值)
                    let tagValueType = appData.tagValueType; //标签值类型(单值/多值)
                    let uid = dataUid;
                    let endTagValue = tagKey + '_tag_' + tagType + '_' + tagValueType;
                    //替换文件的标签
                    appDataMap.set(endTagValue, uid);
                    //存到数组中
                }
            } else {
                //已经注册接口，获取取UId
                let tagKey = appData.tagKey;
                let tagType = appData.tagType;
                let tagValueType = appData.tagValueType;
                let uid = appData.uid;
                let endTagValue = tagKey + '_tag_' + tagType + '_' + tagValueType;
                appDataMap.set(endTagValue, uid);
            }
        }
        return appDataMap;
    }
}


/**
 *客户标签注册
 */
export async function clientTagRegister(params, tagKey) {
    /*    let url = prefix + `/tag/register?${qs.stringify(params)}`;
     let body = [
     {
     "key": tagKey,
     "value": tagKey
     }
     ]
     let data = await getData(url, body, {});*/
    let data = {
        "resCode": "0000",
        "resMsg": "提交成功",
        "statCode": "00000",
        "statMsg": "提交成功",
        "data": {
            "uid": "S0056"
        },
        "sign": "9993F4C6C1B2B594EB197E5EFD15A19A"
    }
    return data;
}


/**
 * 根据id添加Uid
 * @param uid
 * @param id
 */
export async function addUid(uid, id) {
    let data = await AppInfo.update({
        uid: uid
    }, {
        where: {
            id: id
        }
    });
    return data;
}


/**
 * 根据标签的key查找
 * @param tagKey
 * @returns {*}
 */
export async function getBytagKey(tagKey) {
    let keyData = await AppInfo.findAll({
        where: {
            tagKey
        }
    });
    return keyData;
}

/**
 * 存储并替换生成的csv文件
 * @param csvData
 */
export async function createDataCsv(csvData, filePath) {
    //标签已经注册
    console.log('2');
    var map = new Map();
    let firstData = csvData[0];
    let keys = _.keys(firstData);
    for (let key = 0; key < keys.length; key++) {
        let keyValue = keys[key];
        if (_.includes(keyValue, 'tag')) {
            let endKeyValue = _.split(keyValue, '_');
            let tagKey = endKeyValue[0];
            let tagType = endKeyValue[2]; //标签类型(字符串/数值)
            let tagValueType = endKeyValue[3]; //标签值类型(单值/多值)
            let keyData = await getBytagKey(tagKey);
            console.log(keyData);
            let uid = keyData[0].uid
            let endTagValue = tagKey + '_tag_' + tagType + '_' + tagValueType;
            map.set(endTagValue, uid);
        }
    }
    //替换数组
    _.forEach(csvData, (item)=> {
        _.mapKeys(item, (value, key)=> {
            if (_.includes(key, 'tag')) {
                let value = map.get(key);
                if (!_.isEmpty(value)) {
                    item[value] = item[key];
                    delete item['错误信息']
                    delete item[key];
                }
            }
        })
    });

    console.log('qqq', csvData);
}



/**
 * 注册新的标签
 * @param appResultMap
 * @param csvData
 */
export async function createNewDataCsv(appMap,csvData,filePath){
    console.log('1');
    //console.log(appMap);
    //console.log(csvData);
    _.forEach(csvData, (item)=> {
        _.mapKeys(item, (value, key)=> {
            if (_.includes(key, 'tag')) {
                let value = appMap.get(key);
                if (!_.isEmpty(value)) {
                    item[value] = item[key];
                    delete item[key];
                    delete item['错误信息']
                }
            }
        })
    });

    console.log('eeeee', csvData);
    //写入文件
    converterToCsv.json2csv(csvData, (err, csv)=> {
        let buf = iconv.encode(csv, 'gb2312');
        fs.writeFileSync(filePath, buf);
        //console.log(buf);
        //上传数据到数据端
    });
}
