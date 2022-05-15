module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            field: 'id',
            autoIncrement: true
        },
        username: {
            type: Sequelize.STRING,
            field: 'username',
            unique: true,
            validate: {
                len: [1, 100]
            }
        },
        password: {
            type: Sequelize.STRING,
            field: 'password'
        },
        email: {
            type: Sequelize.STRING,
            field: 'email',
            validate: {
                isEmail: true,
                len: [1, 100]
            }
        },
        organisation: {
            type: Sequelize.STRING,
            field: 'organisation',
            validate: {
                len: [1, 100]
            }
        },
        card_num: {
            type: Sequelize.STRING,
            field: 'card_num',
            allowNull: true
        },
        card_expiry: {
            type: Sequelize.STRING,
            field: 'card_expiry',
            allowNull: true
        },
        card_cvv: {
            type: Sequelize.STRING,
            field: 'card_cvv',
            allowNull: true
        }
    }, {
        timestamps: false,
        freezeTableName: true,
        tableName: 'tbl_users'
    });

    return User;
}