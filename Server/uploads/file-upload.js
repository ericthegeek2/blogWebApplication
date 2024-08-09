const multer  = require('multer')
const path = require('path')

const storageConfig = multer.diskStorage({
    destination: path.join(__dirname, "images"),
    filename: (req,file, res) => {
        res(null,Date.now() + "-" + file.originalname)

    }
})

const fileFilterConfig = function(req, file, cb) {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {

        cb(null, true)
        
    }else{
        cb(null, false)
    }
    
}

const upload = multer({
    storage: storageConfig,
    limits: {
        fileSize: 2 * 1024 * 1024
    },

    fileFilter: fileFilterConfig
})

module.exports = upload

