const path = require('path');
const fs = require('fs');

let productos = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../dataBase/products.json'), 'utf8'))

const mainController = {

    index: function (req, res){
        //compartimos los datos de los productos a la vista
        res.render("products/index", {productos : productos}) 
    }

}

module.exports = mainController