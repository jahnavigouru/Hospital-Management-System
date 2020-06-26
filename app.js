const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const mysql = require('mysql')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')
const cookieParser = require('cookie-parser')

const app = express()

//passort
require('./config/passport')(passport)


//EJS
app.use(expressLayouts)
app.set('view engine', 'ejs')

//BodyParser
app.use(express.urlencoded({ extended: false }))

//express-session
app.use(cookieParser('saloni_jahnavi_jinal'))
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
    res.locals.entry = req.flash('entry')
    res.locals.id = req.flash('id')
    res.locals.info = req.flash('info')
    res.locals.record_entry = req.flash('record_entry')
    res.locals.OutApp = req.flash('OutApp')
    res.locals.room = req.flash('room')
    res.locals.queue = req.flash('queue')
    res.locals.prescription = req.flash('prescription')
    res.locals.pl = req.flash('pl')
    res.locals.InAllot = req.flash('InAllot')
    res.locals.queuelab = req.flash('queuelab')
    res.locals.array = req.flash('array')
    
    next()
})

//create connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'HospitalManagment',
    multipleStatements: true
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