module.exports = {
    ensureIsAdmin: function(req, res, next){
        if(req.isAuthenticated() && req.user.role == 3){
            return next();
        }
        req.flash('error_msg', 'Você deve ser admin para entrar aqui')
        res.redirect('/');
    }
}