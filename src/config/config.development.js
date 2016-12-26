import {
	join
} from 'path';


let config = {
	env: 'development',
	mysql: {
		host: '127.0.0.1',
		poolSize: 5,
		user: 'root',
		password: 'root',
		database: 'audience'
	},
	port: 3000,
	uploadDir: join(__dirname, '../../uploads'),
	fileDir: join(__dirname, '../../files'),
	validateDir: join(__dirname, '../../files/validate'),
	logDir: join(__dirname, '../../logs'),
	serverApiPath: "http://222.72.248.198:8888",
	poolSize: 5,
	apiTimeout: 1500,
	privateKey :'A92A66307BBCACBDE16854F9148E9798',
	account:'800002'
}


export default config;
