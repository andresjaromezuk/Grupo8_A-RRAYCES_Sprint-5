const jsonDB = require('../model/jsonDatabase');
const userModel = jsonDB('users');
const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const userController = {

    login: function (req, res){
        res.render("users/login")
    },
    
    register: function (req, res){
        res.render("users/register")
    },

    processRegister: function(req, res){
        let file = req.file
        console.log(file)
        
        const errors = validationResult(req)

        console.log(errors)
        
        if(!errors.isEmpty()){
            let filePath = path.join(__dirname, '../../public/images/users/' + file.filename)
            fs.unlinkSync(filePath)

            return res.render('users/register', {
                errors : errors.mapped(),
                oldData : req.body,
            })

        } else {

            let userToFind = userModel.findFirstByField("email", req.body.email)

            if(userToFind){
                return res.render('users/register', {
                    errors:{
                        email:{
                            msg: 'Las credenciales no son válidas'
                        }
                    }
                })
            }

            let newUser = {
                ...req.body,
                password: bcrypt.hashSync(req.body.password, 10),
                confirmPassword: bcrypt.hashSync(req.body.confirmPassword, 10),
                image: file ? file.filename : "avatar-default-image.jpg",
                token: bcrypt.hashSync(String(Date.now()), 10)
            }

            userModel.create(newUser)

            res.redirect('/users/login')
        }
    },

    processLogin: function(req, res) {

        console.log(req.body.password)
        let userToLogin = userModel.findFirstByField("email", req.body.email)
        
        if (!userToLogin) {
            return res.render('users/login', {
                errors:{
                    email:{
                        msg: 'No se encuentra el usuario'
                    }
                }
            })
        }

        if(!bcrypt.compareSync(req.body.password, userToLogin.password)){
            return res.render('users/login', {
                errors:{
                    password:{
                        msg: 'Alguno de los datos ingresados es incorrecto'
                    }
                }
            })
        } 
        delete userToLogin.password
        delete userToLogin.confirmPassword
        req.session.userLogged = userToLogin
        console.log(req.session.userLogged)
        
        if(req.body.rememberMe){
            res.cookie("token", userToLogin.token,  {maxAge: 1000*60*60*24})
        }

        res.redirect('/users/profile')

    },

    profile: function (req, res) {
        return res.render('users/profile')
    },

    logout: function (req, res)  {
		res.clearCookie('token');
		req.session.destroy();
		return res.redirect('/');
	},

    cart: function (req, res){
        res.render("users/cart")
    }


}

module.exports = userController
