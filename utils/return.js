/**
 * Return pattern for application
 * @returns {{OK_REQUEST: number, BAD_REQUEST: number, FORBIDDEN_REQUEST: number, INTERNAL_SERVER_ERROR: number, invalidJSON: ({status, message, content}|*), internalServerError: ({status, message, content}|*), forbiddenRequest: ({status, message, content}|*), requestCompleted: requestCompleted, requestFailed: requestFailed}}
 */
module.exports = function(app){
    
    function getResponseJSON(message, content){
        return {
            message: message,
            content: content
        }
    }
    
    return {

        OK_REQUEST: 200,
        BAD_REQUEST : 400,
        FORBIDDEN_REQUEST: 403,
        INTERNAL_SERVER_ERROR: 500,

        invalidJSON : getResponseJSON("InvalidJSON", null),
        internalServerError: getResponseJSON('app.__("INTERNAL_SERVER_ERROR")', null),
        forbiddenRequest: getResponseJSON('i18n.__("FORBIDDEN_REQUEST")', null),
        
        requestCompleted : function(content, msg){
            return getResponseJSON(msg, content)
        },

        requestFailed: function(content, msg){
            return getResponseJSON(msg, content)
        },
        
        // Check the i18n
        getMessage : function(info, i18nKey, isNumber){
            var locale = null;
            if(isNumber){
                switch(info.substr(0,3)){
                    case "+55":
                        locale = "ptbr";
                        break;
                    default:
                        locale = "en";
                        break;
                }
            }
            
            app.i18n.setLocale(locale);
            return app.i18n.__(i18nKey);
        }

    }

}