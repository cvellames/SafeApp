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
        getUser: function(req,res,next){
            securityConfig.checkAuthorization(req.params.userId, req.headers.authorization, res, function(){
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
                name: req.body.name,
                phone: req.body.phone
            }).then(function(user){
                const msg = "User inserted with success";
                res.status(returnUtils.OK_REQUEST).json(returnUtils.requestCompleted(user, msg));
            }).catch(function(error){
                res.status(returnUtils.BAD_REQUEST).json(returnUtils.requestFailed(error.errors));
                console.log(error.errors);
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
                    const hashToken = bcrypt.hashSync(plainToken, salts);
                    
                    return user.updateAttributes({
                        activationCode: null,
                        accessToken : hashToken
                    }, {transaction: t})
                })
            }).then(function(result){
                res.status(returnUtils.OK_REQUEST).json(returnUtils.requestCompleted(null, "Account activated"));
            }).catch(function(err){
                console.log(err);
                res.status(returnUtils.INTERNAL_SERVER_ERROR).json(returnUtils.internalServerError());
            });


        },
        
        /**
        * Resend the activation code to user
        * @author Cassiano Vellames <c.vellames@outlook.com>
        */
        resendActivationCode: function(req,res){
            res.json({msg: "not implemented"});
        }
    }
};