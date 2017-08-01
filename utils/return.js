/**
 * Return pattern for application
 * @returns {{OK_REQUEST: number, BAD_REQUEST: number, FORBIDDEN_REQUEST: number, INTERNAL_SERVER_ERROR: number, invalidJSON: ({status, message, content}|*), internalServerError: ({status, message, content}|*), forbiddenRequest: ({status, message, content}|*), requestCompleted: requestCompleted, requestFailed: requestFailed}}
 */
module.exports = function(app){
    
    function getResponseJSON(message, content){
        return {
            message: message,
            content: content === undefined ? null : content
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
        
        requestCompleted : function(msg, content){
            return getResponseJSON(msg, content)
        },

        requestFailed: function(msg, content){
            return getResponseJSON(msg, content)
        },

        /**
         *
         * @author Cassiano Vellames <c.vellames@outlook.com>
         * @param info Phone Number or locale
         * @param i18nKey Key to get i18n
         * @param isNumber If is number, the function verify the first 3 digits to choose a language
         * @returns {string} Returns the value of key passed in right locale
         */
        getI18nMessage : function(i18nKey, info,  isNumber){
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
            } else {
                locale = info == null ? app.core.i18n.DEFAULT_LANGUAGE : info;
            }
            
            app.i18n.setLocale(locale);
            return app.i18n.__(i18nKey);
        }

    }

}