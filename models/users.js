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
        },
        accessToken: {
            field: "access_token",
            type: Sequelize.STRING(100),
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

    /**
     * Insert the activation code and access token in user creation
     */
    Users.beforeCreate(function(user){
        
        const min = 1000;
        const max = 9999;
        const activationCode = Math.floor(Math.random() * (max - min) + min);
        user.activationCode = 1234;//activationCode;
        
    });

    return Users;
};
