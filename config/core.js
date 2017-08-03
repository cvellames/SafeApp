module.exports = {

    server: {
        PORT: 3000,
        getEnvironment : function(){
            return process.env.NODE_ENV.trim();
        }
    },

    i18n:{
        DIRECTORY: '/i18n',
        DEFAULT_LANGUAGE: "ptbr",
        LOCALES:[
            'ptbr',
            'en'
        ]
    },

    plivo: {
        AUTH_ID: 'MAOGUYNWIWZJIXMZQYZW',
        AUTH_TOKEN: 'ZjY2MWViOTY3YzE3ZTc0YzA0MTllM2NiMGU1ZmQ0',
        SRC_NUMBER: "12345"
    }
}