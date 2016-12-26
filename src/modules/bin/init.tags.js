import {TagsInfo,ValKVsInfo,AnalysisInfo} from '../common/models';
import _ from 'lodash';
import {getData} from '../common/util/helper';
import config from '../../config/config';

const prefix = config.serverApiPath;
// const tags = allTags.data.tags;

const getServerTags = async ()=>{
    let url = prefix + '/tag/query';
    let data = await getData(url,null,{method:'get'});
    return data;
};

const initTags = async ()=>{

    let data = await getServerTags();
    await TagsInfo.sync({force:true});
    await TagsInfo.bulkCreate(data.tags);
    await ValKVsInfo.sync({force:true});

    let valTags = [];

    data.tags.forEach(function(item){
        item.valKVs.forEach((kv)=>{
            valTags.push({
                key : kv.key,
                value:kv.value,
                tagUid : item.uid,
                tagName : item.name
            });
        })
    });

    await ValKVsInfo.bulkCreate(valTags);


};

/*const testMaxString = async ()=>{
    let obj = {
        name: '12313'
    }
    for (let i = 0; i < 1000; i++) {
        obj['name'] += 'startasdasdasdasdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd';
    }
    obj['name']+='final';
    console.log(JSON.stringify(obj),null,'/n')
    AnalysisInfo.create({
        taskId : 100,
        result : obj
    })
}*/


initTags();
// testMaxString()
export default initTags;