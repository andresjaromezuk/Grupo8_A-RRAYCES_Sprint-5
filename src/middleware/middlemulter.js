const multer = require('multer');
const path = require('path')

function multerMiddleware(folder, entity){ 

    const storage = multer.diskStorage({

        destination : function(req,file,cb){
            cb(null,path.join(__dirname,'../../public/' + folder));
        },

        filename : function(req,file,cb){
            // template string ``
            cb(null, `img${entity}_${Date.now()}${path.extname(file.originalname)}`)
        }

        });

        return multer({storage});   

}

module.exports = multerMiddleware;




