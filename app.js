// Loading modules
    const path = require('path')
    const express = require('express')
    const app = express()
    const exphbs = require('express-handlebars')
    const mongoose = require('mongoose')
    const bodyParser = require('body-parser')
    const flash = require('connect-flash')
    const session = require('express-session')
    const methodOverride = require('method-override')
    const passport = require("passport")
    const cors = require("cors")
    require('./config/auth')(passport)
    require('./models/Course')
    const Course = mongoose.model('courses')
// App config
    // Cors
        app.use(cors())
    // Session and Flash setup
        app.use(session({
            secret: 'a4f8071f-c873-4447-8ee2',
            resave: true,
            saveUninitialized: true
        }))
    // Passport config
        app.use(passport.initialize())
        app.use(passport.session())
        app.use(flash())
    // Global Vars
        app.use(function(req, res, next){
            res.locals.success_msg = req.flash('success_msg');
            res.locals.error_msg = req.flash('error_msg');
            res.locals.error = req.flash('error');
            res.locals.user = req.user || null;
            next();
        })
    // Method override configs
        app.use(methodOverride('_method'))
    // Body parser config
        app.use(bodyParser.urlencoded({extended: false}))
        app.use(bodyParser.json())
    // Template engine config
        app.engine('handlebars', exphbs({defaultLayout: 'main'}))
        app.set('view engine', 'handlebars');

    //Static folder config
        app.use(express.static(path.join(__dirname,'public')))

    // Mongoose ODM config
        mongoose.Promise = global.Promise;
        mongoose.connect('mongodb://localhost/fsocietyead-dev', {
        useMongoClient: true
        }).then(() => console.log('MongoDB Connected...'))
        .catch(err => console.log(err))

        
// Routes
    // Main Routes
        app.get('/', (req, res) => {
            Course.find({}).populate('author').sort('desc').then(courses =>{
                res.render("index",{courses: courses})
            })
        })
    // Admin Routes
        const admin = require('./routes/admin')
        app.use('/admin', admin)
    // Categories Routes

    // Users Routes
        const users = require('./routes/users')
        app.use('/users', users)
    // Courses Routes
        const courses = require('./routes/courses')
        app.use('/courses', courses)
// Run Server
    const PORT = 3098
    app.listen(PORT, (err) => {
        if(err) throw err;
        console.log("UP And Running!")
    })