const express = require('express')
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Lesson")
const Lesson = mongoose.model("lessons")

router.get("/:id", (req, res) => {
    Lesson.findOne({_id: req.params.id}).then(lesson => {
        res.render("courses/lessons/lesson", {lesson: lesson})
    }).catch(err => {
        req.flash("error_msg", "Esta aula não existe!")
        res.redirect('/')          
    })
})


module.exports = router;