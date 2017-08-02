module.exports = {
    production : {
        database: "safeapp",
        username: "root",
        password: "root",
        params: {
            logging: true,
            host: "localhost",
            dialect: "mysql",
            define: {
                underscored: true
            }
        }
    },
    test : {
        database: "safeapp_test",
        username: "root",
        password: "root",
        params: {
            logging: false,
            host: "localhost",
            dialect: "mysql",
            define: {
                underscored: true
            }
        }
    }

};