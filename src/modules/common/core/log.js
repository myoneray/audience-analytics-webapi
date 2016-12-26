'use strict';
import path from "path";
import bunyan from "bunyan";
import config from "../../../config/config";

let env = config.env;
console.log(config)
let log = bunyan.createLogger({
	name:"webapi",
	streams:[
		{
			level: 'info',
			path: path.join(config.logDir, "/logs.txt")
		}
	],
	serializers: {
		err: bunyan.stdSerializers.err,
		req: bunyan.stdSerializers.req,
		res: bunyan.stdSerializers.res
	}
});
log.level(config.logLevel);

//定日任务日志
let taskLog = bunyan.createLogger({
	name:"task",
	streams:[
		{
			level: 'info',
			path: path.join(config.logDir, "/tasklog.txt")
		}
	],
	serializers: {
		err: bunyan.stdSerializers.err,
		req: bunyan.stdSerializers.req,
		res: bunyan.stdSerializers.res
	}
});
taskLog.level('info');

/*
todo
需要配置logrotate任务
*/

if(env != "development"){
	process.on('SIGUSR2', function () {
	    log.reopenFileStreams();
	    taskLog.reopenFileStreams();
	});
}else{
	// process.once('SIGUSR2', function () {
	//     logs.reopenFileStreams();
	//     process.kill(process.pid, 'SIGUSR2');
	// });
}


export {log, taskLog}