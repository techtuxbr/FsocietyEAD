module.exports = {
    ensureAuthenticated: function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash('error_msg', 'Você deve ter uma conta para entrar aqui')
        res.redirect('/users/login');
    }
}