# 人群画像系统webapi


## 服务器环境配置
	
	curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.1/install.sh | bash
	source $NVM_DIR/nvm.sh 或者 . $NVM_DIR/nvm.sh
	nvm ls-remote 选区最新版本node
	nvm install v6.2.1
	nvm alias default v6.2.1

	设置registry

	npm config set registry https://registry.npm.taobao.org/

	pm2安装
	npm install pm2 -g
	
	gulp安装
	npm install gulp -g
	
	babel-cli安装
    npm install babel-cli -g
    	
	mysql 导入模拟数据 /files/sql/audience.sql文件
	数据库设置地址用户 /src/config/config.production.js 
	
## 发布步骤

    npm install
    npm run build //编译到build目录下
	npm run start //启动pm2（如果已经发布过，先执行pm2 delete audienceWebapi）
	


## 开发环境配置
	nvm
	node v6
	npm config set registry https://registry.npm.taobao.org

	服务器pm2部署

## 第三方模块
	
	全局
	npm install -g nodemon
	npm install -g mocha


	开发环境模块
		npm install --save-dev babel-cli es6工具 提供了babel-node
		npm install --save-dev babel-plugin-transform-runtime
		npm install --save-dev babel-plugin-transform-es2015-modules-commonjs
		npm install --save-dev babel-plugin-transform-async-to-generator

	功能模块

		npm install --save babel-runtime

		npm install --save sequelize
		npm install --save mysql

		npm install --save koa@next
		npm install --save koa-router@next

		npm install --save koa-convert

		npm install --save lodash
		npm install --save moment
		npm install --save request

		npm install --save koa-error
		npm install --save swig

		npm install --save koa-cors

		npm install --save  joi

		npm install --save koa-body 需要对比，先用这个


		cron 定时任务
		bunyan 日志
		co 异步模块，暂时用不到



## 相关工具
	postman
	https://www.baidufe.com/fehelper 前端助手

## mocha 单元测试
	mocha 


