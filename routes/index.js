const express = require('express')
const router = express.Router()
const { ensureAuthenticated } = require('../config/auth')

//DB 
const db = require('../app')

//Welcome Page
router.get('/', (req, res) => res.render('welcome'))

// Dashboard Page
router.get('/Rep_dashboard',  ensureAuthenticated, (req, res) => {
    res.render('Rep_dashboard', {
        UserType: req.user.UserType
    })
})

//patient registration
router.get("/patientinfo",(req,res) => {
    let diseases = 'select d_name, d_id from diseases'
    db.query(diseases, (err, result) => {
        if(err) throw err
        res.render('patientinfo', {
            diseases: result
        })
    })
});

//patient info
router.post('/patientdetails', (req, res) => {
    const { date,name,age,gender,DOB,BloodGrp,phone,address,email,d_id } = req.body
    
    let P_errors = []

    // Check required fields
    if(!date || !name || !age || !gender || !DOB || !BloodGrp || !phone || !address || !email || !d_id ) {
        P_errors.push({msg: 'Please fill in all fields'})
    }

    // Check Age
    if(Number(age) < 0) {
        P_errors.push({ msg: 'Age is incorrect' })
    }

    // Check Mobile 
    if(phone.length != 10 || Number(phone)>9999999999) {
        P_errors.push({ msg: 'Mobile Number is incorrect' })
    }

    if(P_errors.length > 0) {
        req.flash('temp',P_errors)
        res.redirect('/patientinfo')
    }
    else{
        let details = `insert into patient_info set p_dor="${date}",p_name="${name}",p_age=${age},p_gender="${gender}",p_dob="${DOB}",p_bloodgrp="${BloodGrp}",p_phn = ${phone},p_addr="${address}",p_emailid="${email}", d_id = ${d_id}`
        db.query(details, (err, saved) => {
            if(err) throw err
            req.flash('P_success_msg', 'The details have been successfully stored');
            res.redirect("/patientinfo");
        })
    }
})

module.exports = router
