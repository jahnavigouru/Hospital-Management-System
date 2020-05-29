const express = require('express')
const router = express.Router()
const db = require('../app')
const { ensureAuthenticated } = require('../config/auth')


//Welcome Page
router.get('/', (req, res) => res.render('welcome'))
// Dashboard Page
router.get('/dashboard',  ensureAuthenticated, (req, res) => res.render('dashboard'))

//patient registration
router.get("/patientinfo",(req,res) => res.render("patientinfo"));

//patient info
router.post('/patientdetails', (req, res) => {
    const { id,dor,name,age,gender,dob,bloodgrp,phone,address,email } = req.body
    
    let errors = []

    // Check required fields
    if(!id || !dor || !name || !age || !gender || !dob || !bloodgrp || !phone || !address || !email ) {
        errors.push({msg: 'Please fill in all fields'})
    }

    if(errors.length > 0) {
        res.render('patientinfo', { errors,id,dor,name,age,gender,dob,bloodgrp,phone,address,email });
    }
    else{
        let details = `insert into patient_info set id="${id}",p_dor="${dor}",p_name="${name}",p_age="${age}",p_gender="${gender}",p_dob="${dob}",p_bldgrp="${bloodgrp}",p_phn="${phone}",p_addr="${address}",p_emailid="${email}"`
        db.query(details, (err, saved) => {
            if(err) throw err
            req.flash('success_msg', 'The details have been successfully stored');
            res.render("dashboard");
        })
    }
})
module.exports = router