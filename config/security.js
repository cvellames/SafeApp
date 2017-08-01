const returnUtils = require("./../utils/return")();

/**
 * Authorization methods
 * @param app Express application
 * @returns {{leftPadding: string, rightPadding: string, checkAuthorization: checkAuthorization}}
 */
module.exports = function(app){
    
    return {
        /**
        *   Padding for use in accesToken generator
        */
        leftPadding: "@%#$Hdsfhfd#¨#$_346234347+#$&hf",
        
        /**
        *   Padding for use in accesToken generator
        */
        rightPadding: "¨%&#$hfdsh34¨$#¨246!¨#@$¨#$ge",
        
        /**
        *   Checks if the hash sent by the endpoint is valid
        *   @author Cassiano Vellames <c.vellames@outlook.com>
        */
        checkAuthorization: function(hash, res, callback){
            const User = app.db.models.Users;
            User.count({where : {
                accessToken: hash
            }}).then(function(count){
                if(count === 0){
                    res.status(returnUtils.FORBIDDEN_REQUEST).json(returnUtils.forbiddenRequest);
                } else {
                    callback();
                }
            });
        }
    }
    
}