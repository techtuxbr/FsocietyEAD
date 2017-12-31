const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')
require('../models/Category');
require('../models/Course');
const Category = mongoose.model('categories');
const Course = mongoose.model('courses');
router.get('/', (req, res) => {
    res.render('admin/index')
})

// Admin courses CRUD Routes

    router.get('/courses', (req, res) => {
        let coursesArray = []
        Course.find({}).populate('category').sort({date:'desc'}).then(courses => {
            res.render('courses/indexadmin', {courses: courses})
        })
    })

    router.get('/courses/add', (req, res) => {
        Category.find({}).then(categories => {
            res.render('courses/add', {categories: categories})
        }).catch(err => {
            req.flash('error_msg', 'Houver um erro interno ao tentar carregar os dados do curso')
            res.redirect('/admin/courses')   
        })
    })

    router.post('/courses/add', (req, res) => {
        let errors = [];
        if(!req.body.title){
            errors.push({text: 'Por favor adicione um nome'})
        }
        if(!req.body.slug){
            errors.push({text:'Por favor adicione uma slug'})
        }
        if(!req.body.category){
            errors.push({text:'Por favor adicione uma categoria válida'})
        }
        if(!req.body.github){
            errors.push({text:'Por favor adicione uma repositório GitHub'})
        }
        if(!req.body.thumbnail){
            errors.push({text:'Por favor adicione uma thumbnail'})
        }

        if(req.body.category == "null"){
            errors.push({text:'Crie uma categoria antes de criar um curso'})
        }

        if(errors.length > 0){

            Category.find({}).then(categories => {
                res.render('courses/add', {categories: categories,errors: errors, 
                    title: req.body.title,
                    slug: req.body.slug,
                    description: req.body.description,
                    github: req.body.github,
                    thumbnail: req.body.thumbnail })
            }).catch(err => {
                req.flash('error_msg', 'Houver um erro interno ao tentar carregar os dados do curso')
                res.redirect('/admin/courses')   
            })
        }else{
            const newCourse = {
                title: req.body.title,
                slug: req.body.slug,
                description: req.body.description,
                github: req.body.github,
                thumbnail: req.body.thumbnail,
                category: req.body.category
            }
            new Course(newCourse).save().then((course) => {
                req.flash('success_msg', 'Curso criado com sucesso')
                res.redirect("/admin")
            })
        }
    })

    router.get('/courses/edit/:id', (req, res) => {
        Course.findOne({_id: req.params.id}).then(course => {
                return course
        }).then(course => {
            Category.find({}).then(categories => {
                res.render('courses/edit', {course: course, categories: categories})
            })
        }).catch(err=>{
            req.flash('error_msg', 'Este curso não existe')
            res.redirect("/admin/courses")
            return 
        })
    })

    router.post('/courses/edit', (req, res) => {
        let errors = [];
        if(!req.body.title){
            errors.push({text: 'Por favor adicione um nome'})
        }
        if(!req.body.slug){
            errors.push({text:'Por favor adicione uma slug'})
        }
        if(!req.body.category){
            errors.push({text:'Por favor adicione uma categoria válida'})
        }
        if(!req.body.github){
            errors.push({text:'Por favor adicione uma repositório GitHub'})
        }
        if(!req.body.thumbnail){
            errors.push({text:'Por favor adicione uma thumbnail'})
        }

        if(req.body.category == "null"){
            errors.push({text:'Crie uma categoria antes de criar um curso'})
        }

        if(errors.length > 0){
            Course.findOne({_id: req.body.id}).then(course => {
                return course
            }).then(course => {
                Category.find({}).then(categories => {
                    res.render('courses/edit', {course: course, categories: categories})
                })
            }).catch(err=>{
                req.flash('error_msg', 'Este curso não existe')
                res.redirect("/admin/courses")
                return 
            })
        }else{
            const editCourse = {
                title: req.body.title,
                slug: req.body.slug,
                description: req.body.description,
                github: req.body.github,
                thumbnail: req.body.thumbnail,
                category: req.body.category
            }
            Course.findOne({_id: req.body.id}).then(course => {
                    course.title = editCourse.title
                    course.slug = editCourse.slug
                    course.description = editCourse.description
                    course.github = editCourse.github
                    course.thumbnail = editCourse.thumbnail
                    course.category = editCourse.category
                course.save().then(course => {
                    req.flash('success_msg', 'Curso editado com sucesso')
                    res.redirect('/admin/courses')
                } ).catch(err =>{
                    req.flash('error_msg', 'Houver um erro ao salvar a edição do curso')
                    res.redirect('/admin/courses')
                } )
            }).catch(err => {
                req.flash('error_msg', 'Houver um erro ao enviar os dados para edição do curso')
                res.redirect('/admin/courses')
            })   
        }
    })

    router.delete('/courses', (req, res) => {
        Course.remove({_id: req.body.id}).then(() => {
            req.flash('success_msg', 'Curso DELETADO com sucesso')
            res.redirect('/admin/courses')
        }).catch(err => {
            req.flash('error_msg', 'Houver um erro interno ao tentar deletar os dados do curso')
            res.redirect('/admin/courses')   
        })
    })

// Admin categories CRUD Routes
    router.get('/categories', (req, res) => {
        Category.find({}).sort({date:'desc'}).then(categories => {
            res.render('categories/index', {categories: categories})
        })
    })

    router.get('/categories/add', (req, res) => {
        res.render('categories/add')
    })

    router.post('/categories/add', (req, res) => {
        let errors = [];
        if(!req.body.name){
            errors.push({text: 'Por favor adicione um nome'})
        }
        if(!req.body.slug){
            errors.push({text:'Por favor adicione uma slug'})
        }
    
        if(errors.length > 0){
            res.render('categories/add', {errors: errors, 
                name: req.body.name,
                slug: req.body.slug
            })
        }else{
            const newCategory = {
                name: req.body.name,
                slug: req.body.slug
            }
            new Category(newCategory).save().then((category) => {
                req.flash('success_msg', 'Categoria criada!')
                res.redirect("/admin/categories")
            })
        }
    })

    router.get('/categories/edit/:id', (req, res) => {
        Category.findOne({_id: req.params.id}).then(category => {
                res.render('categories/edit', {category: category})
                return
        }).catch(err=>{
            req.flash('error_msg', 'Esta categoria não existe')
            res.redirect("/admin/categories")
            return 
        })
    })

    router.post('/categories/edit', (req, res) => {
        let errors = [];
        if(!req.body.name){
            errors.push({text: 'Por favor adicione um nome'})
        }
        if(!req.body.slug){
            errors.push({text:'Por favor adicione uma slug'})
        }
    
        if(errors.length > 0){
            res.render('categories/add', {errors: errors, category:{ 
                name: req.body.name,
                slug: req.body.slug}
            })
        }else{
            Category.findOne({_id: req.body.id}).then(category => {
                category.name = req.body.name
                category.slug = req.body.slug
                category.save().then(category => {
                    req.flash('success_msg', 'Categoria editada com sucesso')
                    res.redirect('/admin/categories')
                } ).catch(err =>{
                    req.flash('error_msg', 'Houver um erro ao salvar a edição da categoria')
                    res.redirect('/admin/categories')
                } )
            }).catch(err => {
                req.flash('error_msg', 'Houver um erro ao enviar os dados para edição da categoria')
                res.redirect('/admin/categories')
            })   
        }
    })

    router.delete('/categories/:id', (req, res) => {
        Category.remove({_id: req.params.id}).then(() => {
            req.flash('success_msg', 'Categoria DELETADA com sucesso')
            res.redirect('/admin/categories')
        }).catch(err => {
            req.flash('error_msg', 'Houver um erro interno ao tentar deletar os dados da categoria')
            res.redirect('/admin/categories')   
        })
    })

module.exports = router;