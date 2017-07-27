function newActivationCode(){
    const min = 1000;
    const max = 9999;
    return  Math.floor(Math.random() * (max - min) + min);
}

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
     * @author Cassiano Vellames <c.vellames@outlook.com>
     */
    Users.beforeCreate(function(user){
        user.activationCode = newActivationCode();
    });
    
    //////// Personal methods ///////
    
    /**
    *   Renew the activation code
    *   @author Cassiano Vellames <c.vellames@outlook.com>
    */
    Users.updateActivationCode = function(phoneNumber, successCallback, failedCallback){
        Users.findOne({
            where : {
                phone : phoneNumber
            }
        }).then(function(user){
            console.log(user);
            user.updateAttributes({
                activationCode : newActivationCode()
            }).then(function(){
                successCallback()  
            }).catch(function(err){
                failedCallback();
            });
        })
    }

    return Users;
};
