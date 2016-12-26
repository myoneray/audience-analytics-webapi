import {enums} from '../../../config/consts'

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('CrowdInfo', {
        id: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            field: "id"
        },
        crowdId: {
            type: DataTypes.STRING(255),
            allowNull: true,
            field: "crowd_id"
        },

        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
            field: "name"
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
        //上传状态
        status: {
            type: DataTypes.INTEGER(4),
            allowNull: true,
            defaultValue : enums.UploadStatus.uploading,
            field: "status"
        },
        //数据端上传任务的ID
        statusId: {
            type: DataTypes.INTEGER(10),
            allowNull: true,
            field: "status_id"
        },
        //上传行数
        lineCount: {
            type: DataTypes.INTEGER(10),
            allowNull: true,
            field: "line_count"
        },
        isDeleted: {
            type: DataTypes.INTEGER(1),
            allowNull: false,
            defaultValue: enums.Delete.nodeleted,
            field: "is_deleted"
        }
    }, {
        tableName: 'crowd_info'
    });
};