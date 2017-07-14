/**
 * Routes for User
 * @author Cassiano Vellames
 */

module.exports = function(app){
    var controller = app.controllers.user;

    app.get("/user/test", controller.test);
};