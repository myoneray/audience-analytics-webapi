import {
	join
} from 'path';

let config = {
	env: 'production',
	mysql: {
		host: '127.0.0.1',//数据库地址
		poolSize: 5,
		user: 'root',//用户名
		password: 'root',//密码
		database: 'audience'
	},
	port: 9001,
	uploadDir: join(__dirname, '../../uploads'),
	fileDir: join(__dirname, '../../uploads'),
	validateDir: join(__dirname, '../../files/validate'),
	logDir: join(__dirname, '../../logs'),
	serverApiPath: "http://222.72.248.198:8888",//数据端接口的地址
	poolSize: 5,
	apiTimeout: 1500,
	privateKey :'A92A66307BBCACBDE16854F9148E9798',//数据端接口的密钥
	account:'800002'//数据端接口的account
}

export default config;