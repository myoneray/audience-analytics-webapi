import {enums} from '../../../config/consts'

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('TaskInfo', {
        id: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            field: "id"
        },
        //圈定人群数据段返回的id
        crowdId: {
            type: DataTypes.STRING(255),
            allowNull: true,
            field: "crowd_id"
        },
        //画像分析数据端返回的id
        taskId: {
            type: DataTypes.STRING(255),
            allowNull: true,
            field: "task_id"
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
            field: "name"
        },
        //更新周期[D,W,M]
        period: {
            type: DataTypes.STRING(8),
            allowNull: true,
            field: "period"
        },
        //有效期
        expired: {
            type: DataTypes.DATE,
            allowNull: true,
            field: "expired"
        },
        //1，(对应的是客户自定义人群) 0,对应的是银联人群
        clientType :{
            type: DataTypes.INTEGER(1),
            allowNull: false,
            defaultValue: enums.ClientType.yl,
            field: "client_type"
        },
        //自定义人群时候的ID
        clientId :{
            type: DataTypes.INTEGER(10),
            allowNull: true,
            field: "client_Id"
        },

        // 1：精准定向，
        // 0：非精准定向（一期只能提交0）
        isPreo: {
            type: DataTypes.STRING(8),
            allowNull: true,
            defaultValue:"0",
            field: "is_preo"
        },
        //数值（isPreo是1才需要提交，一期不需要传递该值）人群的ID
        scale: {
            type: DataTypes.INTEGER(8),
            allowNull: true,
            field: "scale"
        },
        //分析维度
        dimension : {
            type: DataTypes.STRING(),
            allowNull: true,
            field: "dimension"

        },
        //分析规则
        rules: {
            type: DataTypes.TEXT(),
            allowNull: true,
            field: "rules",
            set : function (val,key) {
                try{
                    if(val){
                        this.setDataValue(key,JSON.stringify(val));
                    }
                }catch(ex){

                }
            },
            get : function(val) {

                let data = this.getDataValue(val);
                try{
                    return JSON.parse(data);
                }catch(ex){

                }
            }

        },
        recordUpdatedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: new Date(),
            field: "record_updated_at"
        },
        existAnalysisInfo: {
            type: DataTypes.INTEGER(1),
            allowNull: true,
            defaultValue: 0,
            field: "exist_analysis_info"
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: Date.now(),
            field: "created_at"
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: Date.now(),
            field: "updated_at"
        },
        createUserId: {
            type: DataTypes.INTEGER(10),
            allowNull: true,
            field: "create_userid"
        },
        updateUserId: {
            type: DataTypes.INTEGER(10),
            allowNull: true,
            field: "update_userid"
        },
        status: {
            type: DataTypes.INTEGER(1),
            allowNull: true,
            field: "status"
        },
        isDeleted: {
            type: DataTypes.INTEGER(1),
            allowNull: false,
            defaultValue: enums.Delete.nodeleted,
            field: "is_deleted"
        }
    }, {
        tableName: 'task_info'
    });
};