const returnUtils = require("./../utils/return")();

module.exports = function(app){
    
    return {
        leftPadding: "@%#$Hdsfhfd#¨#$_346234347+#$&hf",
        rightPadding: "¨%&#$hfdsh34¨$#¨246!¨#@$¨#$ge",
        
        checkAuthorization: function(hash, res, callback){
            const User = app.db.models.Users;
            User.count({where : {
                accessToken: hash
            }}).then(function(count){
                if(count === 0){
                    res.status(returnUtils.FORBIDDEN_REQUEST).json(returnUtils.forbiddenRequest());
                } else {
                    callback();
                }
            });
        }
    }
    
}