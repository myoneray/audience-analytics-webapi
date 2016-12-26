import {enums} from '../../../config/consts'

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('AnalysisInfo', {
        
        taskId: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            allowNull: false,
            autoIncrement: false,
            primaryKey: true,
            field: "task_id"
        },
        result: {
            type: DataTypes.TEXT('medium'),
            allowNull: false,
            field: "result",
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
        isDeleted: {
            type: DataTypes.INTEGER(1),
            allowNull: false,
            defaultValue: enums.Delete.nodeleted,
            field: "is_deleted"
        }
    }, {
        tableName: 'analysis_info'
    });
};