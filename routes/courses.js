const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')
require('../models/Course')
const Course = mongoose.model('courses')


router.get("/:slug", (req, res) => {
    Course.findOne({slug: req.params.slug}).then(course => {
        if(course){
            res.render('courses/course', {course: course})
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