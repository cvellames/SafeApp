/**
 * User Controller
 * @author Cassiano Vellames <c.vellames@outlook.com>
 */
const returnUtils = require("./../utils/return")();
const bcrypt = require("bcrypt");

module.exports = function(app){

    const sequelize = app.db.sequelize;
    const Users = app.db.models.Users;
    const securityConfig = require("./../config/security")(app);
    
    return {
        
        /**
        * Get the basic information of user
        * @author Cassiano Vellames <c.vellames@outlook.com>
        */
        get: function(req,res,next){
            securityConfig.checkAuthorization(req.headers.authorization, res, function(){
                Users.findOne({
                    where: {
                        id : req.params.userId
                    }
                }).then(function(user){
                    res.status(returnUtils.OK_REQUEST).json(returnUtils.requestCompleted(user))
                })
            });
        },
        
        /**
        * Insert a new user in database
        * @author Cassiano Vellames <c.vellames@outlook.com>
        */
        insert: function(req,res){
            Users.create({
                phone: req.body.phone
            }).then(function(user){
                const msg = "User inserted with success";
                user.activationCode = null;
                res.status(returnUtils.OK_REQUEST).json(returnUtils.requestCompleted(user, msg));
            }).catch(function(error){
                console.log(error);
                // Check if the error is unique violation of phone, in this case, resend the activatio code
                if(error.errors[0].path == "phone" && error.errors[0].type == "unique violation"){
                    Users.updateActivationCode(
                        req.body.phone, 
                        res.status(returnUtils.OK_REQUEST).json(returnUtils.requestCompleted(null, "Activation Code sended")),
                        res.status(returnUtils.INTERNAL_SERVER_ERROR).json(returnUtils.internalServerError)
                    )
                } else {
                    res.status(returnUtils.BAD_REQUEST).json(returnUtils.requestFailed(error.errors));
                }
            });
        },
        
        /**
        * Check the activation code and active the account if the code are correct]
        * @author Cassiano Vellames <c.vellames@outlook.com>
        */
        checkActivationCode: function(req,res){

            if(req.body.phone == null){
                res.status(returnUtils.BAD_REQUEST).json(returnUtils.requestFailed(null, "Missing phone param"));
            }

            if(req.body.activationCode == null){
                res.status(returnUtils.BAD_REQUEST).json(returnUtils.requestFailed(null, "Missing activation code param"));
            }
            
            var hashToken;
            sequelize.transaction(function(t){
                return Users.findOne({
                    where : {
                        phone: req.body.phone,
                        activationCode: req.body.activationCode
                    },
                    attributes: ["id", "activationCode"]
                },{transaction : t}).then(function(user){

                    if(user === null){
                        res.status(returnUtils.BAD_REQUEST).json(returnUtils.requestFailed(null, "Phone and activation code does not matches"));
                    }
                    
                    const plainToken = securityConfig.leftPadding + user.id + securityConfig.rightPadding
                    const salts = 10;
                    hashToken = bcrypt.hashSync(plainToken, salts);
                    
                    return user.updateAttributes({
                        activationCode: null,
                        accessToken : hashToken
                    }, {transaction: t})
                })
            }).then(function(result){
                res.status(returnUtils.OK_REQUEST).json(returnUtils.requestCompleted({accessToken : hashToken}, "Account activated"));
            }).catch(function(err){
                res.status(returnUtils.INTERNAL_SERVER_ERROR).json(returnUtils.internalServerError);
            });


        }
    }
};