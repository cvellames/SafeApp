module.exports = function(app){
    
    const sequelize = app.db.sequelize;
    const EmergencyTypes = app.db.models.EmergencyTypes;
    
    return {
        
        /**
        * Verify if exist some emergency type in database. If not, insert the default emergencyTypes
        * @author Cassiano Vellames <c.vellames@outlook.com>
        */
        emergencyTypes : function(){
            
            EmergencyTypes.count("*").then(function(count){
                
                if(count > 0){
                    return;
                }
                
                const emergencyTypes = ["Saúde", "Policia", "Transporte", "Perdido"];
            
                for(var i = 0; i < emergencyTypes.length; i++){
                    EmergencyTypes.create({
                        id: i + 1,
                        name: emergencyTypes[i]
                    })
                }

            });
            
        } 
    }
    
    
}