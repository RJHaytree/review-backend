module.exports = (sequelize, Sequelize, user) => {
    const Subscription = sequelize.define("subscription", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            field: 'id',
            autoIncrement: true
        },
        interval: {
            type: Sequelize.STRING,
            field: 'renewal_interval',
            validate: {
                isIn:[['MONTH', 'ANNUAL']]
            }
        },
        active: {
            type: Sequelize.BOOLEAN,
            field: 'active'
        },
        date_started: {
            type: Sequelize.DATE,
            field: 'date_started',
            validate: {
                isDate: true
            }
        },
        date_ended: {
            type: Sequelize.DATE,
            field: 'date_ended',
            validate: {
                isDate: true
            }
        },
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            field: 'user_id'
        }
    }, {
        timestamps: false,
        freezeTableName: true,
        tableName: 'tbl_subscriptions'
    });

    Subscription.belongsTo(user, {
        foreignKey: 'user_id'
    });

    return Subscription;
}