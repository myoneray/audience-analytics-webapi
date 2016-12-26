import {enums} from '../../../config/consts'

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('AppInfo', {
        id: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            field: "id"
        },
        uid: {
            type: DataTypes.STRING(10),
            allowNull: true,
            field: "uid"
        },
        tagKey: {
            type: DataTypes.STRING(10),
            allowNull: false,
            field: "tag_key"
        },
        userId: {
            type: DataTypes.INTEGER(10),
            allowNull: true,
            field:"user_id"
        },
        tagType:{
            type:DataTypes.INTEGER(1),
            allowNull: false,
            field:"tag_type"
        },
        tagValueType:{
            type: DataTypes.INTEGER(1),
            allowNull: false,
            field:"tag_value_type"
        },
        tagValue:{
            type:DataTypes.STRING(30),
            allowNull:false,
            field:"tag_value"
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
        }
    },{
        tableName:'app_info'
    });
}