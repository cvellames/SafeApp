const fs = require("fs");
const path = require("path");

module.exports = function(app){
    
    const returnUtils = require("./return")(app);

    return {

        /**
         * Do the upload of a file to server
         * @param req Request object
         * @param res Response object
         * @param callback Callback function
         * @author Cassiano Vellames <c.vellames@outlook.com>
         */
        upload: function(req, res, callback){

            // Check file
            if(req.files.file == null){
                callback();
                return;
            }
            
            // Check file extension
            const extension = path.extname(req.files.file.name);
            if(app.core.uploader.ALLOWED_EXTENSIONS.indexOf(extension) === -1){
                callback(returnUtils.getI18nMessage("UPLOADER_INVALID_EXTENSION", req.headers.locale));
                return;
            }

            // Move file to directory
            const tempPath = req.files.file.path;
            const newPath = app.core.uploader.USER_PHOTOS_PATH + req.userInfo.id + extension;
            fs.rename(tempPath, newPath, function(err){
                if(err){
                    callback(returnUtils.getI18nMessage("UPLOADER_ERROR", req.headers.locale));
                } else {
                    callback();
                }
            })
            
        }
    }

}