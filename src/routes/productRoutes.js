/* ------------ REQUIRE'S ------------ */
const express = require('express');
const router = express.Router();

/* ------------ CONTROLLER REQUIRE ------------ */
const productController = require('../controllers/productController')

/* ------------ REQUERIMOS MIDDLEWARE ------------ */
const multerMiddleware = require('../middleware/middlemulter')
const upload = multerMiddleware('images', 'product')
const productCreateValidation = require('../middleware/productCreateValidation')
const productEditValidation = require('../middleware/productEditValidation')
const adminMiddleware = require('../middleware/adminMiddleware')

/* Creamos la ruta hacia productos */
router.get('/', productController.index)

/* Creamos la ruta hacia todos los productos */
router.get('/allProducts', productController.index)

/* Creamos la ruta hacia el detalle de un producto */
router.get('/detail/:id', productController.detail) //armamos ruta parametrizada

/* Creamos la ruta hacia formulario de creación */
router.get('/create', adminMiddleware, productController.create)
/* Ruta para recibir datos del formulario */ 
router.post('/', upload.array('image'), productCreateValidation, productController.store);

/* Creamos la ruta hacia formulario de edición */
router.get('/edit/:id', adminMiddleware, productController.edit);
/* Ruta para editar los datos de producto */
router.put('/edit/:id', upload.array('image'), productEditValidation, productController.update);

/* Ruta para eliminar producto */
router.delete('/delete/:id', adminMiddleware, productController.destroy);

module.exports = router; 
