const { body } = require('express-validator')
const path = require('path')

const productEditValidation = [

    body('name')
        .notEmpty().withMessage('Debes indicar el nombre del producto'),
    
    body('description')
        .notEmpty().withMessage('Debes completar la descripción del producto'),
    
    body('price')
        .notEmpty().withMessage('Debes indicar un precio'),

    body('fees')
        .notEmpty().withMessage('Debes indicar el valor de cada cuota'),
        
    body('image')
        .custom((value, {req}) => {
            let files = req.files
                if(files.length > 0){
                    const extensionesValidas = [".png", ".jpg", ".jpeg"];
                    files.forEach(file => {
                        let filePath = (path.extname(file.originalname))
                    if(!extensionesValidas.includes(filePath)){
                        throw new Error(`Los formatos de imagen válidos son ${extensionesValidas.join(', ')}`);
                    }
                })
                }

            return true

        })

]

module.exports =  productEditValidation