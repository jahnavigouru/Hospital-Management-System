const express = require('express')
const router = express.Router()
const { ensureAuthenticated } = require('../config/auth')

//DB 
const db = require('../app')

//Welcome Page
router.get('/', (req, res) => res.render('welcome'))

// Dashboard Page
router.get('/Rep_dashboard',  ensureAuthenticated, (req, res) => {
    var user = req.user.UserType;    
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
            diseases: result,docname: req.user.name
        })
    })
});

router.get("/appointment",(req,res) => {
    let diseases = 'select d_name,d_id from diseases'
    let doctors = 'select  name,id from users where UserType = "Doctor"';
    db.query(doctors, (err,doctors) => {
        if(err) throw err;
        db.query(diseases, (err, diseases) => {
            if(err) throw err
            res.render('appointment', {
                diseases: diseases,doctors: doctors
            })
        })
    })   
});

router.post("/setappointment", (req,res) => {
    const {doa,p_name,doctor} = req.body
    let check = `select p_id from patient_info where p_name="${p_name}"`
    db.query(check , (err,result) => {
        if (err) throw err
        if(result.length == 0) {
            console.log("Patient is not registered");
            res.render("patientinfo");
        }
        else {
            let details = `insert into records set doa="${doa}",p_id=${result[0].p_id},doc_id=${doctor}`
            db.query(details, (err,result) => {
            if (err) throw err
            console.log("Inserted successfully");
            res.render("Rep_dashboard",{UserType: "Recpetionist"});
        })
        }
    })    
});
const d = new Date();
    const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
    const mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d);
    const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);    
    var dayy = `${ye}-${mo}-${da}`;

var obj = {};
router.get("/doctor",(req,res) => {   
    var email = req.user.email;
    let info = `select name,id from users where email = "${email}" `
    db.query(info , (err,result1) => {
        if (err) throw err
        let pid = `select p_id from records where doc_id = "${result1[0].id}" and doa="${dayy}" and prescriptions IS NULL`
        db.query(pid,(err,result) => {
            console.log("Result");
            console.log(result);
            obj.docname = result1[0].name;
            obj.pids = result;
            if (err) throw err;    
            res.render("doctor",obj);    
        });       
    })
});

var obj2 ={};
router.post("/viewpatient", (req,res) => {
    var pid = req.body.choosepatient;
    let sql = "select patient_info.p_id ,patient_info.p_name , patient_info.p_age , patient_info.p_bloodgrp  from patient_info where patient_info.p_id ="+ pid ;
    db.query(sql,(err,result) => {
        console.log("Result");
        console.log(result);
        obj2 = {data: result};
        if (err) throw err;
        res.render("pview",obj2);    
    });       
});

router.post("/prescription", (req,res) => {
    const p_name = req.body.p_name;
    res.render("prescriptionform",{p_name: p_name});
});

var obj3 = {};
router.post("/records", (req,res) => {
    const {p_name , medicines , labtests, doa } = req.body;
    console.log(p_name);
    console.log(medicines);
    console.log(labtests);
    console.log(doa);
    let p_id ='select p_id from patient_info where p_name="'+ p_name +'"';
    db.query(p_id,(err,result) => {
        if (err) throw err
        console.log("p_id");
        console.log(result);
        console.log(result[0].p_id);

        //updating the row for current appointment 
        let details = `update records set prescriptions="${medicines}",lab_tests="${labtests}" where p_id=${result[0].p_id}`
        db.query(details,(err,updated) => {
            if (err) throw err
            console.log("Updated the current appointment row");
        });  

        //inserting column for next date of appointment
        if(doa.length != 0) {
            let sql = `select doc_id from records where p_id=${result[0].p_id} and doa="${dayy}"`
            db.query(sql,(err,insert) => {
                if (err) throw err
                let nextappt = `insert into records set doa="${doa}",p_id = ${result[0].p_id}, doc_id="${insert[0].doc_id}"`
                db.query(nextappt,(err,appointment) => {
                    if (err) throw err;
                    else {
                        console.log("next appointment added");
                    }
                })
            });              
        }
        
        //values to pass in the doctor page
        let info = `select users.id ,users.name from records natural join users where records.p_id = ${result[0].p_id} and records.doa="${dayy}" and records.doc_id = users.id`
        db.query(info , (err,result1) => {
        if (err) throw err
            let pid = `select p_id from records where doc_id = "${result1[0].id}" and doa="${dayy}" and prescriptions IS NULL`
            db.query(pid,(err,result2) => {
                console.log("Result2");
                console.log(result2);
                obj3.docname = result1[0].name;
                obj3.pids = result2;
                if (err) throw err;    
                res.render("doctor",obj3);    
            });            
        })          
    });
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
        // check user exist
        let user = `select p_phn from patient_info where p_phn = ${phone}`
        db.query(user, (err, exists) => {
            if(err) throw err
            if(exists.length > 0) {
                P_errors.push({ msg: `${exists[0].p_phn} Already registered` })
                req.flash('temp', P_errors)
                res.redirect('/patientinfo')
            }

            //insert 
            let details = `insert into patient_info set p_dor="${date}",p_name="${name}",p_age=${age},p_gender="${gender}",p_dob="${DOB}",p_bloodgrp="${BloodGrp}",p_phn = "${phone}", p_addr="${address}",p_emailid="${email}", d_id = ${d_id}`
            db.query(details, (err, saved) => {
            if(err) throw err
            // success
            let doctor = `select users.name, doctor.room_no from users,doctor where users.id = ( select doc_id from diseases where d_id = ${d_id} ) and doctor.doc_id = ( select doc_id from diseases where d_id = ${d_id} )`
            db.query(doctor, (err, doc) => {
                if(err) throw err
                let id = `select id from patient_info where p_phn = "${phone}"`
                db.query(id, (err, userID) => {
                    if(err) throw err
                    else {
                        let temp_success = []
                        temp_success.push({ msg: `You are have been successfully Registered with id_no: ${userID[0].id}`})
                        temp_success.push({ msg: `please proceed to Room.no: ${doc[0].room_no} and Doctor: Dr. ${doc[0].name}`})
                        req.flash('P_success_msg', temp_success)
                        res.redirect('/patientinfo')
                    } 
                })
            })
          })
        })
    }
})

// Doctor dashboard
router.get('/Doc_dash', (req, res) => {
    res.render('Doc_dash', {
        name: req.user.name,
        specialization: req.user.specialization
    })
})


module.exports = router
