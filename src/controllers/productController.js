const jsonDB = require('../model/jsonDatabase');
const productModel = jsonDB('products');
const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const { validationResult } = require('express-validator');
const path = require('path');
const fs = require('fs');

const productController = { 

	index: function (req, res){
        //compartimos los datos de los productos a la vista
		let productos = productModel.all()
        res.render("products/allProducts", {productos : productos}) 
    },

    detail: (req, res) => {
        let id = Number(req.params.id)
        let producto = productModel.find(id)
		let productos = productModel.all()
        res.render("products/detail", {
            producto: producto,
            productos: productos})
    }, 

	create: (req, res) => {
        res.render("products/create")
    },

	store: (req, res) => {

		let files = req.files
        
        const errors = validationResult(req)

        console.log(errors)

		if(!errors.isEmpty()){
            files.forEach((file) => {
                let filePath = path.join(__dirname, '../../public/images/' + file.filename)
                fs.unlinkSync(filePath)
            })

            return res.render('products/create', {
                errors : errors.mapped(),
                oldData : req.body,
            })
		} 

		let images = []
		

		// cambiamos ciclo for por forEach
		files.forEach(image => {
			images.push(image.filename)
		});

		// capturo todos los campos del body
		let newProduct = {
			...req.body,
			image: req.files.length >= 1  ? images : ["product-default-image.jpg"]
		}

		productModel.create(newProduct)
		res.redirect('/products')

	},

    edit: (req, res) => {
        let id = Number(req.params.id)
		let productos = productModel.all()
        let producto = productos.find(producto => producto.id === id)
        res.render("products/edit", {producto: producto})
    },

	update: (req, res) => {
		let id = Number(req.params.id);
		let productToEdit = productModel.find(id);
		let files = req.files

		const errors = validationResult(req)

        console.log(errors)

		if(!errors.isEmpty()){
            files.forEach((file) => {
                let filePath = path.join(__dirname, '../../public/images/' + file.filename)
                fs.unlinkSync(filePath)
            })

           return res.render('products/edit', {
				producto: productToEdit,
                errors : errors.mapped(),
                oldData : req.body,
            })
		} 

		let images = [];
		
		// cambiamos ciclo for por forEach
		files.forEach(image => {
			images.push(image.filename)
		});

		if(images.length > 0){
            const previousImages = productToEdit.image;
            previousImages.forEach( image => {
                const filePath = path.join(__dirname, `../../public/images/${image}`);
                fs.unlinkSync(filePath);
            })
        }

		productToEdit = {
			id: productToEdit.id,
			...req.body,
			// Si se suben imagenes se pone como valor el array imagenes y sino se queda el que ya estaba antes
			image: files.length >= 1  ? images : productToEdit.image
		}

		productModel.update(productToEdit)
		res.redirect("/");
	},

    destroy: (req,res) => {
		let id = Number(req.params.id);
        let productToDestroy = productModel.find(id)
        console.log(productToDestroy)
        if(productToDestroy.image) {
            const previousImages = productToDestroy.image;
            console.log(previousImages)
            previousImages.forEach( image => {
                const filePath = path.join(__dirname, `../../public/images/${image}`);
                fs.unlinkSync(filePath)
        })

        productModel.delete(id);
        res.redirect("/");
        }
    }
}





module.exports = productController