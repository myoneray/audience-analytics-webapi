
import {taskLog} from '../../common/core/log'
import {CronJob} from 'cron';
import initTags from  '../init.tags';
import {
	TaskStatusJob,TaskPeriodJob
} from './task.status';
//每隔15分钟修改任务状态的接口
const TaskStatusCron = new CronJob({
	// cronTime: "*/15 * * * * *",
	cronTime: "* */15 * * * *",
	onTick : function() {
		try {

			new TaskStatusJob();
		} catch (ex) {
			taskLog.error({
				type: "Sync",
				job: "Task.Info.Status",
				err: ex
			});
		}
	},
	start: true,
	timeZone : 'Asia/ShangHai'
});


//每隔一天执行周期性任务
const TaskPeriodCron = new CronJob({
	cronTime: "* * */24 * * *",
	// cronTime: "* * */24 * * *",
	onTick : function() {
		try {

			new TaskPeriodJob();

			initTags();

		} catch (ex) {
			taskLog.error({
				type: "Sync",
				job: "Task.Info.Period",
				err: ex
			});
		}
	},
	start: true,
	timeZone : 'Asia/ShangHai'
});

TaskStatusCron.start();
TaskPeriodCron.start();



