const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')
require('../models/Course')
require('../models/Lesson')
const Course = mongoose.model('courses')
const Lesson = mongoose.model("lessons")

router.get("/:slug", (req, res) => {
    Course.findOne({slug: req.params.slug}).populate("category").populate("author").then(course => {
        if(course){
            Lesson.find({course: course._id}).populate("course").then((lessons) => {
                res.render('courses/course', {course: course, lessons: lessons})
            }).catch((err) => {
                req.flash("error_msg", "Erro ao carregas as aulas")
                res.redirect('/')      
            })
        }else{
            req.flash("error_msg", "Este curso não existe!")
            res.redirect('/')         
        }
    }).catch(err => {
        req.flash("error_msg", "Este curso não existe!")
        res.redirect('/')
    })
})

router.get("/:slug/lesson/:id", (req, res) => {
    Course.findOne({slug: req.params.slug}).then(course => {
        if(course){
            Lesson.findOne({_id: req.params.id}).then(lesson => {
                Lesson.find({course: course._id}).populate("course").then((lessons) => {
                    res.render("courses/lessons/lesson", {lesson: lesson, lessons: lessons})
                }).catch((err) => {
                    req.flash("error_msg", "Erro ao carregas as aulas")
                    res.redirect('/')      
                })
            }).catch(err => {
                req.flash("error_msg", "Esta aula não existe!")
                res.redirect('/')          
            })
        }else{
            req.flash("error_msg", "Este curso não existe!")
            res.redirect('/')         
        }
    }).catch(err => {
        req.flash("error_msg", "Este curso não existe!")
        res.redirect('/')
    })
})

module.exports = router;