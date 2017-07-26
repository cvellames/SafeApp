/**
 * User Controller
 * @author Cassiano Vellames <c.vellames@outlook.com>
 */
const returnUtils = require("./../utils/return")();

module.exports = function(app){

    const sequelize = app.db.sequelize;
    const Users = app.db.models.Users;

    return {
        get: function(req,res){
            res.status(200).json({msg: "get"});
        },

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

                    return user.updateAttributes({
                        activationCode: null
                    }, {transaction: t})
                })
            }).then(function(result){
                res.status(returnUtils.OK_REQUEST).json(returnUtils.requestCompleted(null, "Account activated"));
            }).catch(function(err){
                res.status(returnUtils.INTERNAL_SERVER_ERROR).json(returnUtils.internalServerError());
            });


        },

        resendActivationCode: function(req,res){
            res.json({msg: "not implemented"});
        }
    }
};