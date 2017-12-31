const localStrategy = require("passport-local").Strategy 
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

//load user model
require('../models/User')
const User = mongoose.model('users')

module.exports = function(passport){
    passport.use(new localStrategy({usernameField: 'email'}, (email, password, done) => {
        User.findOne({
            email: email
        }).then(user => {
            if(!user){
                return done(null, false, {message: 'Esta conta não existe'});
            }

            bcrypt.compare(password, user.password, (err, isMatch) => {
                //if(err) throw err;
                if(isMatch){
                    return done(null, user,)
                }else{
                    return done(null, false, {message: 'Credenciais incorretas'});
                }
            })
        })
    }))

    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });
}