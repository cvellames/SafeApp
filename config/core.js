module.exports = {

    server: {
        PORT: 3000,
        ENVIRONMENT: process.env.ENV_VARIABLE == undefined ? "production" : process.env.ENV_VARIABLE
    },

    plivo: {
        AUTH_ID: 'MAOGUYNWIWZJIXMZQYZW',
        AUTH_TOKEN: 'ZjY2MWViOTY3YzE3ZTc0YzA0MTllM2NiMGU1ZmQ0',
        SRC_NUMBER: "12345"
    }
}