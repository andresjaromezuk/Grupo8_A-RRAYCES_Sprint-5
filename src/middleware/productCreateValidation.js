const { body } = require('express-validator')
const path = require('path')

const productCreateValidation = [

    body('name')
        .notEmpty().withMessage('Debes indicar el nombre del producto'),
    
    body('description')
        .notEmpty().withMessage('Debes completar la descripción del producto'),
    
    body('price')
        .notEmpty().withMessage('Debes indicar un precio'),

    body('fees')
        .notEmpty().withMessage('Debes indicar el valor de cada cuota'),
    
    body('type')
        .custom((value, {req}) => {
            if(req.body.type == ""){
                throw new Error ('Debes seleccionar un tipo de producto')
            }
        
            return true

        }),
    
    body('size')
    .custom((value, {req}) => {
        if(req.body.size == ""){
            throw new Error ('Debes seleccionar el tamaño del producto')
        }
    
        return true

    }),

    body('category')
    .custom((value, {req}) => {
        if(req.body.category == ""){
            throw new Error ('Debes seleccionar una categoría')
        }
   
        return true

    }),

    body('image')
        .custom((value, {req}) => {
            let files = req.files
                if(files.length === 0){
                    throw new Error ('Debes cargar una imagen')
                } else {
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

module.exports =  productCreateValidation