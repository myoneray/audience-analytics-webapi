import Sequelize from 'sequelize';
import config from '../../../config/config';
import {
    join
} from 'path';
import {
    log
} from '../core/log';


let dbConfig = config.mysql;

export let sequelize = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
    host: dbConfig.host,
    dialect: 'mysql',
    pool: {
        max: dbConfig.poolSize,
        min: 0,
        idle: 10000
    },
    //logging: true,
    define: {
        underscored: true,
        hooks: { //http://docs.sequelizejs.com/en/latest/docs/hooks/
            beforeBulkCreate: function (rows) {
                rows.forEach(function (row) {
                    if (typeof row.status == 'undefined' || row.status == null) {
                        row.status = 1;
                    }
                    if (typeof row.isDeleted == 'undefined' || row.isDeleted == null) {
                        row.isDeleted = 0;
                    }
                });
            },
            beforeValidate: function (row) {
                if (typeof row.status == 'undefined' || row.status == null) {
                    row.status = 1;
                }
                if (typeof row.isDeleted == 'undefined' || row.isDeleted == null) {
                    row.isDeleted = 0;
                }
            }
        }
    }
});

sequelize.authenticate().catch(function (errors) {
    log.info({
        type: "Mysql",
        err: errors
    });
});


export let TaskInfo = sequelize.import(join(__dirname, './task.info'));
export let CrowdInfo = sequelize.import(join(__dirname, './crowd.info'));
export let AnalysisInfo = sequelize.import(join(__dirname, './analysis.info'));
export let TagsInfo = sequelize.import(join(__dirname, './tags.info'));
export let ValKVsInfo = sequelize.import(join(__dirname, './valKVs.info'));
export let AppInfo = sequelize.import(join(__dirname, './app.info'));
