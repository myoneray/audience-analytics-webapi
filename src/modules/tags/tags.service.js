'use strict';

import {wrapBody} from '../common/util/helper';
import {TagsInfo,ValKVsInfo} from '../common/models';
import _ from 'lodash';

//标签接口

export async function getAllTags() {


    let data = await TagsInfo.findAll({
        attributes : ['name','uid','typeUid','typeName']
    });

    return data;
}

export async function valKVs(tagUid) {
    let where = {
        tagUid : {
            $in : tagUid
        }
    };

    let kvsData = await ValKVsInfo.findAll({
        where,
        attributes : ['key','value','tagUid','tagName']
    });
   /* if(_.isObject(data)){
        data = [data];
    }*/
    let TagValMap = _.groupBy(kvsData,'tagUid');


    let TagData = await TagsInfo.findAll({
        where : {
            uid : tagUid
        },
        attributes : ['uid','name']
    });
    let finalData = [];

    TagData.map((item)=>{
        finalData.push({
            uid : item.uid,
            name : item.name,
            valKVs : TagValMap[item.uid]
        });
    });

    return finalData;
}
