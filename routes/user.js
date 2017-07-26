/**
 * Routes for User
 * @author Cassiano Vellames
 */

module.exports = function(app){
    var controller = app.controllers.user;

    app.route("/api/user")
        .post(controller.insert)
        .get(controller.get);

    app.route("/api/user/resend_activation_code").
        post(controller.resendActivationCode);

    app.route("/api/user/check_activation_code").
    post(controller.checkActivationCode);
};