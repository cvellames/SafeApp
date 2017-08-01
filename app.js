/**
 * Start the application
 * @author Cassiano Vellames <c.vellames@outlook.com
 */

// Loading modules
const bodyParser = require("body-parser");
const express = require("express");
const expressLoad = require("express-load");
const i18n = require("i18n");

// My Modules
const returnUtils = require("./utils/return")(app);

// Init express
var app = express();

// Insert configs and utils in application
app.core = require("./config/core");
app.plivo = require("./utils/plivo")(app);

// Config i18n
i18n.configure({
    locales:['ptbr', 'en'],
    directory: __dirname + '/i18n',
    defaultLocale: app.core.i18n.DEFAULT_LANGUAGE
});
app.i18n = i18n;

// Config body-parser
app.use(bodyParser.json());
app.use(function(err,req,res,next){
    //Check errors in JSON
    if(err.stack){
        res.status(returnUtils.BAD_REQUEST).json(returnUtils.invalidJSON());
    } else {
        delete req.body.id;
        next();
    }
});

// Config loads
expressLoad("db.js").
then("controllers").
then("routes").
into(app);


// Sync database and start up node server
app.db.sequelize.sync({force:true}).done(function(){
    app.listen(app.core.server.PORT, function(){
        const initialLoad = require("./config/initial_load")(app);
        initialLoad.emergencyTypes();
        app.emit("serverStarted");
        console.log("App running in port " + app.core.server.PORT);
    });
});

module.exports = app;