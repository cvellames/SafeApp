/**
 * Contact Controller
 * @author Cassiano Vellames <c.vellames@outlook.com>
 */
module.exports = function(app){
    
    const sequelize = app.db.sequelize;
    const Contacts = app.db.models.Contacts;
    const securityConfig = require("./../config/security")(app);
    const returnUtils = require("./../utils/return")(app);
    
    return {
        
        insert: function(req,res){
            
            // Check not null params
            if(req.body.name == null || req.body.phone == null){
                const msg = returnUtils.getI18nMessage("MISSING_PARAM");
                res.status(returnUtils.BAD_REQUEST).json(returnUtils.requestFailed(msg));
                return;
            }
            
            // Check if the contact have the same number of user
            if(req.body.phone == req.userInfo.phone){
                
            }
            
            Contacts.create({
                name: req.body.name,
                phone: req.body.phone,
                user_id: req.userInfo.id
            }).then(function(contact){
                
            }).catch(function(){
                res.status(returnUtils.INTERNAL_SERVER_ERROR).json(returnUtils.internalServerError(req.headers.locale));
            });
        },
        
        update: function(req,res){
            res.json({"msg" : "update"});
        },
        
        remove: function(req,res){
            res.json({"msg" : "delete"});
        }
        
    };
};