module.exports = function(sequelize, Sequelize){
    const Emergencies = sequelize.define("Emergencies", {
        id: {
            type: Sequelize.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        status: {
            type: Sequelize.ENUM(100),
            allowNull: false,
            values: ["IN_PROGRESS", "SOLVED", "CANCELED", "EXPIRED"]
        }
    }, {
        tableName: "emergencies",
        classMethods: {
            associate: function(models){
                Emergencies.belongsTo(models.EmergencyTypes, {foreignKey: {allowNull: false}});
                Emergencies.belongsTo(models.Users, {foreignKey: {allowNull: false}});
                Emergencies.hasMany(models.EmergenciesLocales);
            }
        }
    });

    return Emergencies;
};
