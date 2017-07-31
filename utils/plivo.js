module.exports = function(app){
    const plivo = require('plivo');
    
    return {
        
        OK_STATUS : 202,
        
        send: function(dst, txt){
            
            
            var p = plivo.RestAPI({
              authId: app.apis.plivo.AUTH_ID,
              authToken: app.apis.plivo.AUTH_TOKEN
            });

            var params = {
                'src': app.apis.plivo.SRC_NUMBER,
                'dst' : dst,
                'text' : txt
            };
            p.send_message(params, function (status, response) {
                console.log('Status: ', status);
                console.log('API Response:\n', response);
            });
        },   
    
        sendActivationCode: function(dst, activationCode){
            const plivoMsg = "Hi, to advance in your registration, please insert the following activation code in aplication: " + activationCode;
            this.send(dst, plivoMsg);
        }
    }
}