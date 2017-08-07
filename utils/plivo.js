/**
 * SMS functions
 * @param app Express aplication
 * @returns {{send: send, sendActivationCode: sendActivationCode}}
 */
module.exports = function(app){
    const plivo = require('plivo');
    const returnUtils = require("./return")(app);
    
    return {
        /**
         * Default method to send sms
         * Only in production environment
         * @author Cassiano Vellames <c.vellames@outlook.com<
         * @param dst Number destiny
         * @param txt Text to send
         */
        send: function(dst, txt){

            if(app.core.server.getEnvironment() != "production"){
                return;
            }

            var p = plivo.RestAPI({
              authId: app.core.plivo.AUTH_ID,
              authToken: app.core.plivo.AUTH_TOKEN
            });

            var params = {
                'src': app.core.plivo.SRC_NUMBER,
                'dst' : dst,
                'text' : txt
            };
            p.send_message(params, function (status, response) {
                console.log('Status: ', status);
                console.log('API Response:\n', response);
            });
        },

        /**
         * Send an sms with the activation code to number
         * @author Cassiano Vellames <c.vellames@outlook.com>
         * @param dst Number destiny
         * @param activationCode Activation code
         */
        sendActivationCode: function(dst, activationCode){
            const plivoMsg = returnUtils.getI18nMessage("PLIVO_ACTIVATION_CODE", dst, true) + activationCode;
            this.send(dst, plivoMsg);
        },
        
        sendNewContactInformation: function(dst, username){
            const plivoMsg = username + " " + returnUtils.getI18nMessage("PLIVO_NEW_CONTACT", dst, true);
            this.send(dst, plivoMsg);
        }
    };
};