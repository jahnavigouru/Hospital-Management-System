const express = require('express')
const db = require('../app')
const bcrypt = require('bcryptjs')
const passport = require('passport')

const router = express.Router()


// login page
router.get('/login', (req, res) => res.render('login'))

//register page
router.get('/register', (req, res) => res.render('register'))

//register handel
router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body
    
    let errors = []

    // Check required fields
    if(!name || !email || !password || !password2) {
        errors.push({msg: 'Please fill in all fields'})
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
        res.render('register', {
            errors,
            name, 
            email, 
            password,
            password2
        })
    }else{
        let find = `select UserID from users where UserID = ${email}`
        db.query(find, (err, result) =>{
            if(err) throw err
            if(result.length > 0){
               //if user exist
               errors.push({ msg: `${email} UserID already exists` })
               res.render('register', {
                   name, email, password, password2,errors
               })
            }else if(result.length == 0){
                
               //Hash password
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(password, salt, (err, hash) => {
                        if(err) throw err

                        //set password to hash
                        const pass = hash

                        //save new user
                        let newUser = `insert into users set name = "${name}", UserID = "${email}", password = "${pass}"`
                        db.query(newUser, (err, saved) => {
                            if(err) throw err
                            req.flash('success_msg', 'You are now Successfully registered')
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
    passport.authenticate('local', {
      successRedirect: '/dashboard',
      failureRedirect: '/users/login',
      failureFlash: true
    })(req, res, next);
  })

module.exports = router