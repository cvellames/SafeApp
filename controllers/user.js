/**
 * User Controller
 * @author Cassiano Vellames <c.vellames@outlook.com>
 */

module.exports = function(app){

    const sequelize = app.db.sequelize;

    return {
        test: function(req,res){
            res.status(200).json({msg: "ok"});
        }
    }
};