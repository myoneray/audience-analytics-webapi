import {enums} from '../../../config/consts'

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('ValKVsInfo', {
        id: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            field: "id"
        },
        key: {
            type: DataTypes.STRING(255),
            allowNull: true,
            field: "key"
        },
        value: {
            type: DataTypes.STRING(255),
            allowNull: true,
            field: "value"
        },
        tagUid: {
            type: DataTypes.STRING(255),
            allowNull: false,
            field: "tag_uid"
        },
        tagName: {
            type: DataTypes.STRING(255),
            allowNull: false,
            field: "tag_name"
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
        tableName: 'val_kvs_info'
    });
};