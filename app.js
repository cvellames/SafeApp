/**
 * Start the application
 * @author Cassiano Vellames <c.vellames@outlook.com
 */

// Loading modules
var bodyParser = require("body-parser");
var express = require("express");
var expressLoad = require("express-load");

// Init express
var app = express();

// Config body-parser
app.use(bodyParser.json());
app.use(function(err,req,res,next){

    //Check errors in JSON
    if(err.stack){

    }
    delete req.body.id;
    next();
});

// Config loads
expressLoad("db.js").
then("controllers").
then("routes").
into(app);

// Sync database and start up node server
app.db.sequelize.sync({force:false}).done(function(){
    app.listen(3000, function(){
        console.log("ERP running in port 3000")
    });
});
