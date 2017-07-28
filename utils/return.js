module.exports = function(){
    
    function getResponseJSON(status, message, content){
        return {
            status: status,
            message: message,
            content: content
        }
    }
    
    return {

        OK_REQUEST: 200,
        BAD_REQUEST : 400,
        FORBIDDEN_REQUEST: 403,
        INTERNAL_SERVER_ERROR: 500,

        invalidJSON : getResponseJSON("Error", "InvalidJSON", null),
        internalServerError: getResponseJSON("Error", "Internal Server Error. Contact the support", null),
        forbiddenRequest: getResponseJSON("Forbidden", "You are not authorized to access this route", null),
        
        requestCompleted : function(content, msg){
            return getResponseJSON("Success", msg, content)
        },

        requestFailed: function(content, msg){
            return getResponseJSON("Error", msg, content)
        }

    }

}