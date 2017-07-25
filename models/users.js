module.exports = function(sequelize, Sequelize){
    const Users = sequelize.define("Users", {
        id: {
            type: Sequelize.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING(100),
            allowNull: true
        },
        phone:{
            type: Sequelize.STRING(15),
            allowNull: false,
            unique: true
        },
        activationCode: {
            field: "activation_code",
            type: Sequelize.STRING,
            allowNull: true
        }
    }, {
        tableName: "users",
        classMethods: {
            associate: function(models){
                Users.hasMany(models.Contacts);
                Users.hasMany(models.Emergencies);
            }
        }
    });

    return Users;
};
