import {enums} from '../../../config/consts'

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('TagsInfo', {
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
        name: {
            type: DataTypes.STRING(255),
            allowNull: true,
            field: "name"
        },
        version: {
            type: DataTypes.STRING(10),
            allowNull: true,
            field: "version"
        },
        typeUid: {
            type: DataTypes.STRING(10),
            allowNull: true,
            field: "type_uid"
        },
        typeName: {
            type: DataTypes.STRING(10),
            allowNull: true,
            field: "type_name"
        },
        /*valKVs : {
            type: DataTypes.STRING(2048),
            allowNull: true,
            field: "value_kvs",
            set : function (val) {
                console.log(val)
                this.setDataValue(JSON.stringify(val));
            },
            get : function(val) {
                let data = this.getDataValue(val);
                try{
                    if(data){
                        return JSON.parse(data);
                    }
                }catch (ex){

                }

            }
        },*/
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

        //参数级别
        level: {
            type: DataTypes.INTEGER(10),
            allowNull: false,
            defaultValue : 1,
            field: "level"
        },
        isDeleted: {
            type: DataTypes.INTEGER(1),
            allowNull: false,
            defaultValue: enums.Delete.nodeleted,
            field: "is_deleted"
        }
    }, {
        tableName: 'tags_info'
    });
};