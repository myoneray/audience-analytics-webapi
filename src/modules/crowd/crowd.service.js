import {
    TaskInfo
} from '../common/models';
import _ from 'lodash';
import {enums} from '../../config/consts'
import config from '../../config/config'
import {getData} from '../common/util/helper';
import {CrowdInfo} from '../common/models';
import iconv from 'iconv-lite';
import fs from 'fs';
import path from 'path';
var Converter = require("csvtojson").Converter;
var converterToCsv = require('json-2-csv');

const prefix = config.serverApiPath;

//数据端创建数据
const serverCreate = async(body)=> {
    let url = prefix + '/crowd/delineation';
    await getData(url, body);
}

export async function create(body) {
    //新建表
    // await CrowdInfo.sync();

    let data = await CrowdInfo.create(body);
    return data;

}

export async function list() {
    let where = {
        isDeleted: enums.Delete.nodeleted
    };
    let attributes = ['id', 'crowdId', 'name'];
    let data = await CrowdInfo.findAll({
        attributes,
        where
    });

    return data;
}


export async function remove(id) {
    let url = prefix + '/crowd/delineation';
    let data = await CrowdInfo.update({
        isDeleted: enums.Delete.deleted
    }, {
        where: {
            id: id
        }
    });
    return data;
}


export function validate(file) {
    return new Promise((reslove, reject)=> {
        var validateObj = {
            '字符串': (str)=> {
                return _.isString(str) ? '' : ''
            },
            '单值': (str, key)=> {
                return (String(str) && String(str).split(';').length > 1) ? `${key}标签为单值类型数据不允许传多值` : ''
            },
            '多值': (str)=> {
                return _.isString(str) ? '' : ''
            },
            '数值': (str, key)=> {
                return _.isNumber(str) ? '' : `${key}标签类型为数值类型，不允许上传字符串类型标签值`
            },
            'iphone': (str)=> {
                if(!str) return '';
                return (Number(str) && String(str).length === 11) ? '' : '手机号格式错误'
            }
        };

        var converter = new Converter({});

        converter.on("end_parsed", function (csvData) {

            let rules = {
                phone_key: ['iphone']
            };
            let validate = true;
            let lineCount = (csvData && csvData.length) ? csvData.length : 0;
            let rulesKey = _.keys(csvData[0]);

            if (rulesKey) {
                _.each(rulesKey, (ruleKey)=> {
                    let nameArr = ruleKey.split('_')
                    if (_.includes(nameArr, 'tag')) {
                        rules[ruleKey] = [nameArr[2], nameArr[3]]
                    }
                })
            }

            csvData.forEach(item=> {
                let err = [];
                if (!item['phone_key'] && !item['imei_key'] && !item['idfa_key']) {
                    err.push('该行数据无用户标识');
                }

                _.each(item, (val, key)=> {
                    if (rules[key]) {
                        _.each(rules[key], (funcN)=> {
                            if (validateObj[funcN]) {
                                if (validateObj[funcN](val, key)) {
                                    err.push(validateObj[funcN](val, key.split('_')[0]))
                                }
                            }
                        })
                    }
                });
                if (err.length > 0) validate = false;
                item['错误信息'] = err.join(';');
            });

            console.log(csvData);

            converterToCsv.json2csv(csvData, (err, csv)=> {
                if (err) {
                    reject({
                        validate,
                        lineCount,
                        result: err
                    });
                }
                let buf = iconv.encode(csv, 'gb2312');
                //fs.writeFileSync(filePath, buf);

                reslove({
                    validate,
                    lineCount,
                    result: buf,
                    data:csvData,
                    key:rulesKey,
                    csv:csv
                });
                /*fs.writeFileSync(filePath,buf,{
                 encoding : 'utf8'
                 })*/
            });

        });

        fs.createReadStream(file).pipe(iconv.decodeStream('gb2312')).pipe(converter)
    });
}

export async function downloadTemplate() {

    let fileName = path.join(__dirname, '../../../files/template/template.csv');
    return fileName;
}

export async function downloadValidate(id) {

    let fileName = path.join(config.validateDir, `/${id}.csv`);

    return fileName;
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
        attributes: ['id', 'crowdId', 'name', 'lineCount', 'status', 'createdAt', 'updatedAt'],
        raw: true
    };
    let total = await CrowdInfo.count({where});
    let list = await CrowdInfo.findAll(condition);
    return {
        total,
        list,
        pageSize: limit,
        pageIndex: offset
    };

}