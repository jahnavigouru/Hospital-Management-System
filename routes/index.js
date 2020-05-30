const express = require('express')
const router = express.Router()
const { ensureAuthenticated } = require('../config/auth')

//DB 
const db = require('../app')
var docname;
//Welcome Page
router.get('/', (req, res) => res.render('welcome'))

// Dashboard Page
router.get('/Rep_dashboard',  ensureAuthenticated, (req, res) => {
    var user = req.user.UserType;
    if(user == "Doctor") {
        db.query("select name from users where id="+req.user.id,(err,result) => {
            if (err) throw err;
            docname = result[0].name;      
            res.redirect("/doctor");
        });
    }
    else {
        res.render('Rep_dashboard', {
            UserType: req.user.UserType
        })
    }    
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

var obj = {};
//patient registration
router.get("/doctor",(req,res) => {
    console.log(docname);
    obj.docname = docname;
    let pid = "select p_id from patient_info where d_id = (select diseases.d_id from diseases natural join doctor natural join users where users.name = '"+docname +"')";
    db.query(pid,(err,result) => {
        console.log("Result");
        console.log(result);
        obj.pids = result;
        if (err) throw err;    
        res.render("doctor",obj);    
    });       
});

var obj2 ={};
router.post("/viewpatient", (req,res) => {
    var pid = req.body.choosepatient;
    let sql = "select patient_info.p_id ,patient_info.p_name , patient_info.p_age , patient_info.p_bloodgrp , diseases.d_name from diseases natural join patient_info where patient_info.p_id ="+ pid ;
    db.query(sql,(err,result) => {
        console.log("Result");
        console.log(result);
        obj2 = {data: result};
        if (err) throw err;
        res.render("pview",obj2);    
    });       
});

router.post("/prescription", (req,res) => {
    res.render("prescriptionform");
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
