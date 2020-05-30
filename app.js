const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const mysql = require('mysql')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')

const app = express()

//passort
require('./config/passport')(passport)


//EJS
app.use(expressLayouts)
app.set('view engine', 'ejs')

//BodyParser
app.use(express.urlencoded({ extended: false }))

//express-session
app.use(session ({
    secret: 'saloni_jahnavi_jinal',
    resave: true,
    saveUninitialized: true
}))

//passport
app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash())

//Global Variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.P_success_msg = req.flash('P_success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    res.locals.temp = req.flash('temp')
    
    next()
})

//create connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'hospitalmanagement'
})

//connect
db.connect((err) =>{
    if(err) throw err
    console.log('Mysql connected!');
})

module.exports = db

//router
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))

const PORT = 8080

app.listen((PORT), () => console.log(`server is running on port ${PORT}`))