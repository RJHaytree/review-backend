module.exports = (sequelize, Sequelize) => {
    const Item = sequelize.define("item", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            field: 'id',
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING,
            field: 'name',
        },
        brand: {
            type: Sequelize.STRING,
            field: 'brand'
        }
    }, {
        timestamps: false,
        freezeTableName: true,
        tableName: 'tbl_reviewed_items'
    });

    return Item;
}