const adminMiddleware = (req, res, next) => {
    
    if(!req.session.userLogged.admin == true){
        return res.redirect("/");
    }
    
    next()
} 

module.exports = adminMiddleware;