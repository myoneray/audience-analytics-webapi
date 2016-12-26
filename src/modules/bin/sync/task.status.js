import qs from 'querystring';
import _ from 'lodash';
import co from 'co';
import moment from 'moment';
import {TaskInfo, AnalysisInfo, TagsInfo, ValKVsInfo} from '../../common/models'
import {enums} from '../../../config/consts';
import config from '../../../config/config';
import {getData} from '../../common/util/helper';
import {taskLog as log} from "../../common/core/log";

const prefix = config.serverApiPath;
const TaskStatusJob = class {
    constructor() {
        let that = this;
        co(function*() {
            try {
                yield that.init();
            } catch (ex) {
                log.error({
                    type: "SyncStatus",
                    err: ex,
                    info: "程序执行错误"
                });
                process.exit();
            }
        });
    }

    async init() {
        console.log('------------------------------------------' + 111111)
        //每隔15分钟查询所有未删除，正在执行的任务
        let TaskData = await TaskInfo.findAll({
            attributions: ['id', 'taskId', 'dimension', 'status', 'recordUpdatedAt'],
            where: {
                isDeleted: enums.Delete.nodeleted,
                status: {
                    $in: [enums.TaskStatus.loading, enums.TaskStatus.executing]
                }
            }
        });
        // 暂时每次查询一个汇总任务的执行状态！！！！

        // let taskIdArr = _.map(TaskData, item=>item.taskId);

        //同步到server端的task的任务状态
        /*let serverTaskData = [];


         for (let i = 0; i < TaskData.length; i = i + 50) {
         let taskIds = taskIdArr.splice(i, 50).join(',');
         if (taskIds) {
         let tempData = await this.syncStatusFromServer(taskIds);
         serverTaskData = serverTaskData.concat(tempData.tasks);
         }
         }*/

        for (let i = 0; i < TaskData.length; i++) {
            let item = TaskData[i];
            let serverTaskData = await this.syncStatusFromServer(item.taskId);

            let TaskDimensionArr = item.dimension.split(',');
            if (serverTaskData) {
                let serverTaskStatusArr = _.map(serverTaskData.tasks,(item)=>{
                    return Number(item.taskState);
                });
                //状态
                let status = this.getStatusByArr(serverTaskStatusArr);
                let result = {
                    result : []
                };
                //更新状态
                let condi = {
                    status,
                    //只要有分析状态返回，则task_info表recordUpdatedAt的记录就是当前的时间
                    recordUpdatedAt: Date.now()
                };

                if (status == Number(enums.TaskStatus.success)) {
                    //此处正在构造查询成功状态的前端数据返回结果
                    for (let j = 0; j < serverTaskData.tasks.length; j++) {
                        let taskStatusItem = serverTaskData.tasks[j];
                        let index = j;
                        let resultItem = {};
                        resultItem.uid = TaskDimensionArr[index];
                        //根据维度去查询标签的name
                        resultItem.name = await this.getNameByUid(resultItem.uid);
                        resultItem.taskId = taskStatusItem.taskId;
                        if (taskStatusItem.taskResult) {
                            let tempA = [];
                            let taskResultArr = taskStatusItem.taskResult.split(',');
                            taskResultArr.forEach(taskResultItem => {
                                tempA.push({
                                    key: taskResultItem.split(':')[0],
                                    // name: taskResultItem.split(':')[0],
                                    percent: taskResultItem.split(':')[1]
                                });
                            });
                            resultItem.valKVs = tempA;
                        }
                        result.result.push(resultItem);
                        if (taskStatusItem.taskState) {
                            if (item.expired && moment(item.expired).format() < moment(new Date()).format()) {
                                //对于周期性任务 判断一下有效期是否超过 则停止
                                status = enums.TaskStatus.stop
                            }
                        }
                    }

                    //只要有分析结果success，则task_info表的exist_analysis_info 记录就是1

                    _.assign(condi, {
                        existAnalysisInfo: 1
                    });

                    // await AnalysisInfo.sync();
                    //如果分析表内有id了 则更新分析记录， 不存在则插入一条新的分析记录，
                    //只要有分析结果，则task_info表的exist_analysis_info 记录就是true


                    await AnalysisInfo.upsert({
                        taskId: item.id,
                        result
                    }, {
                        validate: true,
                        field: ['result']
                    })

                }

                //更新taskInfo表内
                await TaskInfo.update(condi, {
                    where: {
                        id: item.id
                    }
                });
            }



        }

    }

    //数据端任务状态更新
    async syncStatusFromServer(taskId) {

        let query = {
            taskId
        };
        let url = prefix + `/task/query?${qs.stringify(query)}`;

        let data = await getData(url, {}, {method: 'get'});

        return data;

    }

    async getNameByUid(uid) {
        let data = await TagsInfo.findOne({
            attributions: ['name'],
            where: {
                uid
            }
        });
        if(data){
            return data.name;
        }
        return '';
    }

    async getValKVsByUid(uid) {
        let data = await ValKVsInfo.find({
            attributions: ['key', 'value'],
            where: {
                tagUid: uid
            }
        });
        return data.value;
    }

    getStatusByArr(arr) {
        if (_.includes(arr, enums.TaskStatus.loading)) {
            console.log(enums.TaskStatus.loading)
            return enums.TaskStatus.loading;
        }
        if (_.includes(arr, enums.TaskStatus.executing)) {
            console.log(enums.TaskStatus.executing)

            return enums.TaskStatus.executing;
        }
        if (_.includes(arr, enums.TaskStatus.stop)) {
            console.log(enums.TaskStatus.stop)
            return enums.TaskStatus.stop;
        }
        if (_.includes(arr, enums.TaskStatus.failure)) {
            console.log(enums.TaskStatus.failure)
            return enums.TaskStatus.failure;
        }
        if (_.includes(arr, enums.TaskStatus.success)) {
            console.log(enums.TaskStatus.success)
            return enums.TaskStatus.success;
        }

    }
};


const TaskPeriodJob = class {
    constructor() {
        let that = this;
        co(function*() {
            try {
                yield that.init();
            } catch (ex) {
                log.error({
                    type: "SyncPeriod",
                    err: ex,
                    info: "程序执行错误"
                });
                process.exit();
            }
        });
    }

    async init() {
        console.log(222222222222222)

        //每个一天查询所有 非正在执行的 未过期的周期性任务
        let TaskData = await TaskInfo.findAll({
            attributions: ['id', 'taskId', 'status', 'recordUpdatedAt', 'createdAt'],
            where: {
                isDeleted: enums.Delete.nodeleted,
                expired: {
                    //选择有效期大于今天的任务
                    $gte: Date.now()
                },
                period: {
                    $in: [enums.PeriodStatus.weekly, enums.PeriodStatus.monthly]
                },
                status: {
                    $notIn: [enums.TaskStatus.loading, enums.TaskStatus.executing]
                }
            }
        });
        //所有的需要去server同步状态的任务的id
        if (TaskData) {
            for (let i = 0; i < TaskData.length; i++) {
                let item = TaskData[i];
                if (item.expired && moment(item.expired).format() > moment(new Date()).format()) {
                    //是否在周期内
                    if ((item.period === enums.PeriodStatus.weekly &&
                        moment(item.expired).diff(moment(item.createdAt), 'day') % 7 == 0) ||
                        (item.period === enums.PeriodStatus.monthly &&
                        moment(item.expired).diff(moment(item.createdAt), 'day') % 30 == 0)) {


                        let taskIdArr = item.taskId.split(',');
                        if (taskIdArr.length > 0) {
                            for (let j = 0; j < taskIdArr.length; j++) {
                                let idItem = taskIdArr[j];
                                await this.startServerTask(idItem);
                            }

                            let condi = {
                                status: enums.TaskStatus.loading
                            };
                            //更新taskInfo表内
                            await TaskInfo.update(condi, {
                                where: {
                                    id: item.id
                                }
                            });
                        }

                    }
                }
            }
        }

    };


    async startServerTask(taskId) {

        let query = {
            taskId,
            state: 0//0是启动，1是停止任务
        };

        let url = prefix + `/task/stateUpdate?${qs.stringify(query)}`;

        let data = await getData(url, body);
        return data;
    }
};

export {
    TaskStatusJob,
    TaskPeriodJob
} ;





