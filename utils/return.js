module.exports = function(){

    return {

        OK_REQUEST: 200,
        BAD_REQUEST : 400,
        FORBIDDEN_REQUEST: 403,
        INTERNAL_SERVER_ERROR: 500,

        invalidJSON : function(){
            return {
                status : 'Error',
                msg : "Invalid JSON",
                content : null
            }
        },

        requestCompleted : function(content, msg){
            if(msg === undefined){
                msg = "Request Completed";
            }

            return {
                status : "Success",
                msg : msg,
                content : content
            }
        },

        requestFailed: function(content, msg){
            if(msg === undefined){
                msg = "Request Failed";
            }

            return {
                status : "Error",
                msg : msg,
                content : content
            }
        },

        internalServerError: function(){
            return {
                status : "Error",
                msg: "Internal Server Error. Contact the support",
                content: null
            }
        },
        
        forbiddenRequest: function(){
            return {
                status : "Forbidden",
                msg: "You are not authorized to access this route",
                content: null
            }
        }

    }

}