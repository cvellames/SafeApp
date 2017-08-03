/**
 * User Controller
 * @author Cassiano Vellames <c.vellames@outlook.com>
 */
module.exports = function(app){

    const bcrypt = require("bcrypt");
    const sequelize = app.db.sequelize;
    const Users = app.db.models.Users;
    const securityConfig = require("./../config/security")(app);
    const returnUtils = require("./../utils/return")(app);
    
    return {
        
        /**
        * Get the basic information of user
        * @author Cassiano Vellames <c.vellames@outlook.com>
        */
        get: function(req,res){
            securityConfig.checkAuthorization(req, res, function(){
                Users.findOne({
                    where: {
                        accessToken : req.headers.authorization
                    }
                }).then(function(user){
                    res.status(returnUtils.OK_REQUEST).json(returnUtils.requestCompleted(null, user))
                }).catch(function(){
                    res.status(returnUtils.INTERNAL_SERVER_ERROR).json(returnUtils.internalServerError(req.headers.locale));
                })
            });
        },
        
        /**
        * Insert a new user in database or resend the activation code
        * @author Cassiano Vellames <c.vellames@outlook.com>
        */
        insert: function(req,res){

            if(req.body.phone == null){
                const msg = returnUtils.getI18nMessage("MISSING_PARAM");
                res.status(returnUtils.BAD_REQUEST).json(returnUtils.requestFailed(msg));
                return;
            }

            Users.count({where : {phone : req.body.phone}}).then(function(count){
               if(count === 1){

                    const successCb = function(activationCode){
                        app.plivo.sendActivationCode(req.body.phone, activationCode);
                        const msg = returnUtils.getI18nMessage("ACTIVATION_CODE_RESENT");
                        res.status(returnUtils.OK_REQUEST).json(returnUtils.requestCompleted(msg));
                    };

                    const failCb = function(){
                        res.status(returnUtils.INTERNAL_SERVER_ERROR).json(returnUtils.internalServerError());
                    };

                    Users.updateActivationCode(
                        req.body.phone,
                        successCb,
                        failCb
                    );

               } else {
                   Users.create({
                       phone: req.body.phone
                   }).then(function(user){
                       app.plivo.sendActivationCode(req.body.phone, user.activationCode);
                       user.activationCode = null;
                       const msg = returnUtils.getI18nMessage("USER_INSERTED", req.body.phone, true);
                       res.status(returnUtils.OK_REQUEST).json(returnUtils.requestCompleted(msg, user));
                   }).catch(function(error){
                       res.status(returnUtils.INTERNAL_SERVER_ERROR).json(returnUtils.internalServerError());
                   });
               }
            });
        },
        
        /**
        * Check the activation code and active the account if the code are correct]
        * @author Cassiano Vellames <c.vellames@outlook.com>
        */
        checkActivationCode: function(req,res){

            if(req.body.phone == null || req.body.activationCode == null){
                const msg = returnUtils.getI18nMessage("MISSING_PARAM");
                res.status(returnUtils.BAD_REQUEST).json(returnUtils.requestFailed(msg));
                return;
            }
            
            var hashToken;
            var transactionFinished = false;
            sequelize.transaction(function(t){
                return Users.findOne({
                    where : {
                        phone: req.body.phone,
                        activationCode: req.body.activationCode
                    },
                    attributes: ["id", "activationCode"]
                },{transaction : t}).then(function(user){
                    if(user === null){
                        const msg = returnUtils.getI18nMessage("ACTIVATION_CODE_DOES_NOT_MATCH");
                        res.status(returnUtils.BAD_REQUEST).json(returnUtils.requestFailed(msg));
                        transactionFinished = true;
                        return;
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
                if(!transactionFinished){
                    const msg = returnUtils.getI18nMessage("USER_ACTIVATED");
                    res.status(returnUtils.OK_REQUEST).json(returnUtils.requestCompleted(msg, {accessToken : hashToken}));
                }
            }).catch(function(err){
                res.status(returnUtils.INTERNAL_SERVER_ERROR).json(returnUtils.internalServerError());
            });


        }
    }
};