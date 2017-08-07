/**
 * Routes for User
 * @author Cassiano Vellames
 */

const apis = require("../config/core");

module.exports = function(app){
    var controller = app.controllers.user;
    
    app.route("/api/user")
        .put(controller.insert)
        .patch(controller.update)
        .get(controller.get);

    app.route("/api/user/activate").
        post(controller.checkActivationCode);
    
    app.get("/", function(req,res){
        res.json({"Hi" : "Aloha!!!!!!!!!"})
    });
};