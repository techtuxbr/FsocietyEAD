module.exports = {
    authBlock: function(req, res, next){
        if(req.isAuthenticated()){
            req.flash('error_msg', 'Você já tem uma conta')
            res.redirect('/');
            return
        }
        return next();
    }
}