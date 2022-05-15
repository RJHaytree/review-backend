module.exports = (sequelize, Sequelize, apiKey, item) => {
    const Review = sequelize.define("review", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            field: 'id',
            autoIncrement: true
        },
        reviewer: {
            type: Sequelize.STRING,
            field: 'reviewer'
        },
        rating: {
            type: Sequelize.INTEGER,
            field: 'rating'
        },
        date_added: {
            type: Sequelize.DATE,
            field: 'date_added',
            validate: {
                isDate: true
            }
        },
        description: {
            type: Sequelize.STRING,
            field: 'description'
        },
        api_key_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            field: 'api_key_id'
        },
        item_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            field: 'item_id'
        }
    }, {
        timestamps: false,
        freezeTableName: true,
        tableName: 'tbl_reviews'
    });

    Review.belongsTo(apiKey, {
        foreignKey: 'api_key_id'
    });

    Review.belongsTo(item, {
        foreignKey: 'item_id'
    });

    return Review;
}