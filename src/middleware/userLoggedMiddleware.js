const jsonDB = require('../model/jsonDatabase');
const userModel = jsonDB('users');

function  userLoggedMiddleware (req, res, next) {

    res.locals.isLogged = false

    const userCookie= req.cookies.token
    const userFromCookie = userModel.findFirstByField("token", userCookie) 

    if(userFromCookie){
        
        delete userFromCookie.password
        delete userFromCookie.confirmPassword
        req.session.userLogged = userFromCookie
        console.log (userFromCookie)
    }

    if(req.session.userLogged){
        res.locals.isLogged = true
        res.locals.userLogged = req.session.userLogged
    }

    next()
}

module.exports = userLoggedMiddleware