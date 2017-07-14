/**
 * Database configuration and sequelize configuration
 * @author Cassiano Vellames <c.vellames@outlook.com>
 */

// Load Sequelize Module
const Sequelize = require("sequelize");

// Load the database configuration
const config = require("./config/database");

// Load Path and FileSystem library
const path = require("path");
const fs = require("fs");

var sequelize = null;
module.exports = function() {

    // Singleton for instance of Sequelize
    if (!sequelize) {
        sequelize = new Sequelize(
            config.database,
            config.username,
            config.password,
            config.params
        );
    }

    // Database Object with the sequelize instance, sequelize module and all models in projet
    var db = {
        sequelize: sequelize,
        Sequelize: Sequelize,
        models: {}
    };

    // Basic model dir
    const modelsDir = path.join(__dirname, "models");

    // Read the directory to find all models
    fs.readdirSync(modelsDir).forEach(function(file){
        var model = sequelize.import(path.join(modelsDir, file));
        db.models[model.name] = model;
    });

    // Read all associations in models
    Object.keys(db.models).forEach(function(key) {
        if ("associate" in db.models[key]) {
            db.models[key].associate(db.models);
        }
    });

    return db;
};