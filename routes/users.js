const express = require('express')
const db = require('../app')
const bcrypt = require('bcryptjs')
const passport = require('passport')

const router = express.Router()


// login page
router.get('/login', (req, res) => res.render('login'))

//register page
router.get('/register', (req, res) =>{
    let diseases = 'select d_name, d_id from diseases'
    db.query(diseases, (err, result) => {
        if(err) throw err
        res.render('register', {
            diseases: result
        })
    })
})

//register handel
router.post('/register', (req, res) => {
    const { name, DOB, gender, age, address ,phone, type, spe, date, email, password, password2 } = req.body
  
    let errors = []

    // Check required fields
    if(!name || !DOB || !gender || !age || !type || !date || !email || !password || !password2 || !address ) {
        errors.push({msg: 'Please fill in all fields'})
    }

    //Specialization
    if(type !== 'Doctor') {
        if(spe !== 'NA') {
            errors.push({ msg: 'Please Check the Specialization' })
        }
    }else{
        if(spe == 'NA'){
            errors.push({ msg: 'Please Check the Specialization' })
        }
    }

    // Check Age
    if(Number(age) < 15) {
        errors.push({ msg: 'Age is incorrect' })
    }

    // Check Mobile 
    if(phone.length != 10 || Number(phone)>9999999999) {
        errors.push({ msg: 'Mobile Number is incorrect' })
    }

    // Check password
    if(password !== password2) {
        errors.push({ msg: 'Password do not match' })
    }

    // Check password length
    if(password.length < 6) {
        errors.push({ msg: 'Password length in less than 6' })
    }

    if(errors.length > 0) {
        req.flash('entry', errors)
        res.redirect('/users/register')
    }else{
        let find = `select email from users where email = "${email}"`
        db.query(find, (err, result) =>{
            if(err) throw err
            if(result.length > 0){
               //if user exist
               errors.push({ msg: `${email} UserID already exists` })
               res.render('register', {
                name, DOB, gender, age, type, date, email, password, password2, errors
               })
            }else if(result.length == 0){
                
               //Hash password
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(password, salt, (err, hash) => {
                        if(err) throw err

                        //set password to hash
                        const pass = hash

                        //save new user
                        let newUser = `insert into users set name = "${name}", UserType = "${type}", gender = "${gender}", specialization = "${spe}", DOB = "${DOB}", Age = ${age}, address = "${address}", Date_joning = "${date}", phone_number = "${phone}", email = "${email}", password = "${pass}" `
                        db.query(newUser, (err, saved) => {
                            if(err) throw err
                            req.flash('success_msg', `You are now Successfully registered`)
                            res.redirect('/users/login')
                        })
                    })
                }) 
            }
        })
    }
})

// Login Handel
router.post('/login', (req, res, next) => {
    var email = req.body.email
    if(email.includes('management')) {
        passport.authenticate('local', {
            successRedirect: '/Rep_dashboard',
            failureRedirect: '/users/login',
            failureFlash: true
        })(req, res, next);
    }
    if(email.includes('doctor')) {
        passport.authenticate('local', {
            successRedirect: '/Doc_dash',
            failureRedirect: '/users/login',
            failureFlash: true
        })(req, res, next);
    }
    if(email.includes('pharmacy')) {
        passport.authenticate('local', {
            successRedirect: '/Pharmacy_dashboard',
            failureRedirect: '/users/login',
            failureFlash: true
        })(req, res, next);
    }
    if(email.includes('laboratory')) {
        passport.authenticate('local', {
            successRedirect: '/laboratory',
            failureRedirect: '/users/login',
            failureFlash: true
        })(req, res, next);
    }
    if(email.includes('IPD')) {
        passport.authenticate('local', {
            successRedirect: '/ipd_dash',
            failureRedirect: '/users/login',
            failureFlash: true
        })(req, res, next);
    }
  })

//logout
router.get('/logout', (req, res) => {
    req.logout()
    req.flash('success_msg', 'You are logged out')
    res.redirect('/users/login')
})

module.exports = router