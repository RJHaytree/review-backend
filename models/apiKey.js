module.exports = (sequelize, Sequelize, user) => {
    const ApiKey = sequelize.define("apiKey", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            field: 'id',
            autoIncrement: true
        },
        key: {
            type: Sequelize.STRING,
            field: 'api_key',
            unique: true
        },
        date_generated: {
            type: Sequelize.DATE,
            field: 'date_generated',
            validate: {
                isDate: true
            }
        },
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            field: 'enabled'
        },
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            field: 'user_id'
        }
    }, {
        timestamps: false,
        freezeTableName: true,
        tableName: 'tbl_api_keys'
    });

    ApiKey.belongsTo(user, {
        foreignKey: 'user_id'
    });

    return ApiKey;
}