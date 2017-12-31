// Importing modules
    const express = require('express')
    const router = express.Router()
    const mongoose = require('mongoose')
    const bcrypt = require('bcryptjs')
// Importing database models
    require('../models/Category')
    require('../models/Course')
    require('../models/Lesson')
    require('../models/User')
    const Category = mongoose.model('categories')
    const Course = mongoose.model('courses')
    const Lesson = mongoose.model('lessons')
    const User = mongoose.model('users')
// Admin main page
    router.get('/', (req, res) => {
        res.render('admin/index')
    })

// Admin courses CRUD Routes

    router.get('/courses', (req, res) => {
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

// Admin lessons CRUD Routes

router.get('/courses/:id/lessons', (req, res) => {
    Course.findOne({_id: req.params.id}).then(course => {
        return course
    }).catch(err => {
        req.flash('error_msg', 'Este curso não existe')
        res.redirect('/admin/courses')  
    }).then(course => {
        Lesson.find({course: course._id}).populate('course').sort({date:'asc'}).then(lessons => {
            res.render('courses/lessons', {course: course, lessons})
        })
    })
})

router.get('/courses/:id/lessons/add', (req, res) => {
    res.render('courses/lessons/add', {id: req.params.id})
})

router.post('/courses/lesson/add', (req, res) => {
    const newLesson = {
        title: req.body.title,
        course: req.body.id,
        source: req.body.source,
        time: Number((req.body.timeMinutes*60)) + Number(req.body.timeSeconds)
    }
    new Lesson(newLesson).save().then(() => {
        req.flash('success_msg', 'Aula criada com sucesso')
        res.redirect(`/admin/courses/${req.body.id}/lessons`)  
    }).catch(err => {
    })
})

router.get('/lessons/edit/:id', (req, res) => {
    Lesson.findOne({_id: req.params.id}).then( lesson => {
       console.log(lesson)
        // Converting seconds to minutes
            let time = lesson.time
            time = time*0.0166667;
            let timeMinutes = Math.trunc(time)
            let timeSeconds = (Math.trunc((time%1)*60))
        // Rendering View with Data
        console.log(lesson)
            res.render('courses/lessons/edit', {lesson: lesson, timeMinutes: timeMinutes, timeSeconds: timeSeconds})
    })
})


router.post('/lesson/edit', (req, res) => {
    const editLesson = {
        title: req.body.title,
        source: req.body.source,
        time: Number((req.body.timeMinutes*60)) + Number(req.body.timeSeconds)
    }

    Lesson.findOne({_id: req.body.id}).then(lesson => {
        lesson.title = editLesson.title
        lesson.source = editLesson.source
        lesson.time = editLesson.time
    lesson.save().then(lesson => {
        req.flash('success_msg', 'Aula editada com sucesso')
        res.redirect(`/admin/courses/${lesson.course}/lessons`)
    } ).catch(err =>{
        req.flash('error_msg', 'Houver um erro ao salvar a edição da aula')
        res.redirect('/admin/courses/')
    } )
}).catch(err => {
    req.flash('error_msg', 'Houver um erro ao enviar os dados para edição da aula')
    res.redirect('/admin/courses/')
})

})

router.delete('/lesson', (req, res) => {
    Lesson.remove({_id: req.body.id}).then(() => {
        req.flash('success_msg', 'Aula DELETADA com sucesso')
        res.redirect(`/admin/courses/${req.body.courseId}/lessons`)
    }).catch(err => {
        req.flash('error_msg', 'Houver um erro interno ao tentar deletar os dados da aula')
        res.redirect(`/admin/courses/${req.body.courseId}/lessons`)
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

// Users CRUD Routes
    // Users List
        router.get('/users', (req, res) => {
            User.find({deactivate: 0}).then(users => {
                res.render('users/index', {users: users})
            }).catch(err => {
                req.flash("error_msg", "Houve um erro interno ao listar os usuários")
                res.redirect("/admin/")
            })
        })
    // User creation form
        router.get('/users/add', (req, res) => {
            res.render('users/add')
        })
    // User creation process
        router.post('/users/add', (req, res) => {
            let errors = [];
            if(!req.body.name){
                errors.push({text:"Por favor adicione um nome válido"})
            }
            if(!req.body.surname){
                errors.push({text: "Por favor adicione um sobrenome"})
            }
            if(!req.body.email){
                errors.push({text: "Por favor adicione um email"})
            }
            if(!req.body.password){
                errors.push({text:"Por favor adicione uma senha"})
            }
            if(req.body.password != req.body.password2){
                errors.push({text:"As senhas tem que ser iguais"})
            }
            if(!req.body.role || (req.body.role != 0 && req.body.role != 1 && req.body.role != 2 && req.body.role !=3)){
                errors.push({text:"Por favor selecione um tipo válido para o usuário"})
            }
            if(errors.length > 0){
                res.render('users/add', {errors: errors})
                return
            }else{
                User.findOne({email: req.body.email}).then(user => {
                    if(user){
                        errors.push({text: "Já existe uma conta com este e-mail"})
                        res.render('users/add', {errors: errors})
                    }else{
                        const newUser = new User({
                            name: req.body.name,
                            surname: req.body.surname,
                            email: req.body.email,
                            password: req.body.password,
                            role: req.body.role,
                            deactivate: 0
                        })
                
                        bcrypt.genSalt(10, (err, salt) => {
                            bcrypt.hash(newUser.password, salt, (err, hash) => {
                                if(err) throw err;
                                newUser.password = hash;
                                newUser.save().then(user => {
                                    req.flash('success_msg', 'Usuário criado com sucesso')
                                    res.redirect('/admin/users');
                                }).catch(err => {
                                    console.log(err)
                                    return;
                                })
                            })
                        })
                    }
                }).catch(err => {
                    req.flash('error_msg', "Houve um erro intero ao registrar o usuário!")
                    res.redirect('/admin/users')
                })
            }
        })
    // User edit from
        router.get('/users/:id/edit', (req, res) => {
            User.findOne({_id: req.params.id}).then(user => {
                res.render('users/edit', {user: user})
            }).catch(err => {
                req.flash('error_msg', "Este usuário não existe")
                res.redirect('/admin/users')
            })
        })
    // User edit proccess
        router.post('/users/edit', (req, res) => {
            let errors = [];
            if(!req.body.name){
                errors.push({text:"Por favor adicione um nome válido"})
            }
            if(!req.body.surname){
                errors.push({text: "Por favor adicione um sobrenome"})
            }
            if(!req.body.email){
                errors.push({text: "Por favor adicione um email"})
            }
            if(!req.body.role || (req.body.role != 0 && req.body.role != 1 && req.body.role != 2 && req.body.role !=3)){
                errors.push({text:"Por favor selecione um tipo válido para o usuário"})
            }
            if(!req.body.id){
                error.push({text: "ID inválida"})
            }
            if(errors.length > 0){
                res.render('users/add', {errors: errors, course:{
                    name: req.body.name,
                    surname: req.body.surname,
                    email: req.body.email,
                    bio: req.body.bio,
                    picture: req.body.picture
                }})
                return
            }else{
                User.findOne({_id: req.body.id}).then(user => {
                    User.findOne({email: req.body.email}).then(userAux => {
                        if(userAux){
                            if(user.email == userAux.email){
                                user.name = req.body.name
                                user.surname = req.body.surname
                                user.email = req.body.email
                                user.bio = req.body.bio
                                user. picture = req.body.picture
                                user.save().then(() => {
                                    req.flash('success_msg', "Usuário editado com sucesso")
                                    res.redirect('/admin/users')            
                                }).catch(err => {
                                    req.flash('error_msg', "Houve um erro ao salvar o registro no banco")
                                    res.redirect('/admin/users')
                                })
                            }else{
                                req.flash('error_msg', "Já existe um conta com este e-mail")
                                res.redirect('/admin/users')  
                            }
                        }else{
                            user.name = req.body.name
                            user.surname = req.body.surname
                            user.email = req.body.email
                            user.bio = req.body.bio
                            user. picture = req.body.picture
                            user.save().then(() => {
                                req.flash('success_msg', "Usuário editado com sucesso")
                                res.redirect('/admin/users')            
                            }).catch(err => {
                                req.flash('error_msg', "Houve um erro ao salvar o registro no banco")
                                res.redirect('/admin/users')
                            })
                        }
                    }).catch(err => {
                        console.log(err)
                        req.flash('error_msg', "Houve um erro durante a verificação do e-mail")
                        res.redirect('/admin/users')
                    })
                }).catch(err => {
                    req.flash('error_msg', "Este usuário não existe")
                    res.redirect('/admin/users')
                })
            }
    })

    // User creation process
        router.post('/users/deactivate', (req, res) => {
            User.findOne({_id: req.body.id}).then(user => {
                user.deactivate = 1
                user.save().then(() => {
                    req.flash('success_msg', 'Usuário desativado com sucesso')
                    res.redirect('/admin/users');
                }).catch(err => {
                    req.flash('error_msg', "Houve um erro intero ao tentar desativar o usuário! 2")
                    res.redirect('/admin/')
                })
            }).catch(err => {
                req.flash('error_msg', "Houve um erro intero ao tentar desativar o usuário!")
                res.redirect('/admin/')
            })
        })    
module.exports = router;