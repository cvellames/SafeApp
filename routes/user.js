/**
 * Routes for User
 * @author Cassiano Vellames
 */

module.exports = function(app){
    var controller = app.controllers.user;
    
    app.route("/api/user")
        .post(controller.insert)
        .get(controller.get);

    app.route("/api/user/activate").
        post(controller.checkActivationCode);
};