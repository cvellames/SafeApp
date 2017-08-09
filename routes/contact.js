/**
 * Routes for Contacts
 * @author Cassiano Vellames
 */

const apis = require("../config/core");

module.exports = function(app){
    var controller = app.controllers.contact;
    const securityConfig = require("./../config/security")(app);
    const returnUtils = require("./../utils/return")(app);
    
    app.all("/api/contact", function(req, res, next){
        securityConfig.checkAuthorization(req, res, function(){
            next();    
        });
    });
    
    app.route("/api/contact")
        .post(controller.insert)
        .put(controller.update)
        .delete(controller.remove);

    app.get("/api/contact/:contactId", function(req, res){
        securityConfig.checkAuthorization(req, res, function(){
            controller.getOne(req,res);   
        });
    });

    app.route("/api/contacts")
        .get(controller.getOne);
     
};