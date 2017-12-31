// Loading modules
    const express = require('express')
    const router = express.Router()
    const mongoose = require('mongoose')
    const bcrypt = require('bcryptjs')
    const passport = require('passport')
    const {authBlock} = require('../helpers/authBlock');
// Loading Database models
    require('../models/User')
    const User = mongoose.model('users')

// Register functionality
    // Register form
        router.get("/register", authBlock, (req, res) => {
            res.render('users/register')
        })
    // Register process
        router.post('/register', authBlock, (req, res) => {
            let errors = [];
            if(!req.body.name){
                errors.push({text:"Por favor adicione um nome válido"})
            }
            if(req.body.name.length < 2){
                errors.push({text: "Nome muito pequeno, tente novamente"})
            }
            if(!req.body.surname){
                errors.push({text: "Por favor adicione um sobrenome"})
            }
            if(req.body.surname.length < 2){
                error.push({text: "Sobremome muito pequeno, tente novamente"})
            }
            if(!req.body.email){
                errors.push({text: "Por favor adicione um email"})
            }
            if(req.body.password != req.body.repeatPassword){
                errors.push({text: "As senhas são diferentes"})
            }
            if(req.body.password.length < 4){
                errors.push({text: "A senha é muito pequena"})
            }
        
            if(errors.length > 0){
                res.render('users/register', {
                    errors: errors,
                    name: req.body.name,
                    surname: req.body.surname,
                    email: req.body.email,
                    password: req.body.password
                });	
            }else{
                User.findOne({email: req.body.email})
                    .then(user => {
                        if(user){
                            req.flash("error_msg", "Já existe uma conta com esse email")
                            res.redirect("/users/register")
                            return 
                        }else{
                            const newUser = new User({
                                name: req.body.name,
                                email: req.body.email,
                                password: req.body.password,
                                surname: req.body.surname,
                                role: 0
                            })
                    
                            bcrypt.genSalt(10, (err, salt) => {
                                bcrypt.hash(newUser.password, salt, (err, hash) => {
                                    if(err) throw err;
                                    newUser.password = hash;
                                    newUser.save().then(user => {
                                        req.flash('success_msg', 'Conta criada com sucesso')
                                        res.redirect('login');
                                    }).catch(err => {
                                        console.log(err)
                                        return;
                                    })
                                });
                            })
                        }
                    })
            }
        })

// Login functionality
    // Login
        router.get("/login", authBlock, (req, res) => {
            res.render("users/login")
        })
    // Login Process
        router.post("/login", authBlock, (req, res, next) => {
            passport.authenticate('local',{
                successRedirect: '/',
                failureRedirect: '/users/login',
                failureFlash: true
            })(req, res, next)
        })

module.exports = router;