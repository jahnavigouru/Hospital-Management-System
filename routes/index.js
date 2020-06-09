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

//New Patient registration
router.get("/patientinfo",(req,res) => {
    let diseases = 'select d_name, d_id,consultancy_fee from diseases, doctor where doctor.doc_id = diseases.doc_id'
    db.query(diseases, (err, result) => {
        if(err) throw err
        res.render('patientinfo', {
            diseases: result
        })
    })
});

//New Patient registration Handle
router.post('/patientdetails', (req, res) => {
    const { date, name, age, gender, DOB, BloodGrp, phone, address, email, d_id, consultancy_fee } = req.body
    
    let P_errors = []

    // Check required fields
    if(!date || !name || !age || !gender || !DOB || !BloodGrp || !phone || !address || !email || !d_id || !consultancy_fee ) {
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
            let details = `insert into patient_info set p_dor="${date}",p_name="${name}",p_age=${age},p_gender="${gender}",p_dob="${DOB}",p_bloodgrp="${BloodGrp}",p_phn = "${phone}", p_addr="${address}",p_emailid="${email}"`
            db.query(details, (err, saved) => {
            if(err) throw err
            // success
            let doctor = `select users.name, doctor.room_no from users,doctor where users.id = ( select doc_id from diseases where d_id = ${d_id} ) and doctor.doc_id = ( select doc_id from diseases where d_id = ${d_id} )`
            db.query(doctor, (err, doc) => {
                if(err) throw err
                let id = `select p_id from patient_info where p_phn = "${phone}"`
                db.query(id, (err, userID) => {
                    if(err) throw err
                    
                    //records table
                    let records = `insert into records set doa = "${date}", p_id = ${userID[0].p_id}, d_id = ${d_id}, prescription = "NA"`
                    db.query(records, (err, rec) => {
                        if(err) throw err
                        //bill table
                        let fees = `insert into bill set p_id = ${userID[0].p_id}, p_doa = "${date}", bill_type = "Registration-500, consultancy_fee-${consultancy_fee}"`
                        db.query(fees, (err, paid) => {
                            if(err) throw err
                            let temp_success = []
                            temp_success.push({ msg: `You are have been successfully Registered with id_no: ${userID[0].p_id}`})
                            temp_success.push({ msg: `please proceed to Room.no: ${doc[0].room_no} and Doctor: Dr. ${doc[0].name}`})
                            req.flash('P_success_msg', temp_success)
                            res.redirect('/patientinfo')
                        })
                    })
                })
            })
          })
        })
    }
})

//Out-Patient
router.get('/outPatient', (req, res) => {
    let dis = 'select d_name, d_id,consultancy_fee from diseases, doctor where doctor.doc_id = diseases.doc_id'
    db.query(dis, (err, result) => {
        if(err) throw err
        res.render('outPatient', {
            diseases: result
        })  
    })
})

//outPatientID Appointment 
var uniqueid = 0
router.post('/outPatientID', (req, res) => {
    uniqueid = req.body.Unique_id
    //check user match
    let match_id = `select p_id, p_name, p_age, p_gender, p_bloodgrp from patient_info where p_id = ${uniqueid} or p_phn = ${uniqueid}`
    db.query(match_id, (err, isMatch) => {
        if(err) throw err
        if(isMatch.length == 0){
            req.flash('id', 'Please Check information')
            res.redirect('/outPatient')
        }else{
            req.flash('OutApp', isMatch)
            res.redirect('/outPatient')
        }
    })
})

//outPatientID Appointment Handle
router.post('/OutApp', (req, res) =>{
    const { date, spe, consultancy_fee } = req.body
    if(uniqueid.length == 10) {  
       // find user id
       let findID = `select p_id from patient_info where p_phn = ${uniqueid}`
       db.query(findID, (err, done) => {
           if(err) throw err
            //Appoint 
            let app = `insert into records set doa = "${date}", p_id = ${done[0].p_id}, d_id = ${spe}, prescription = "NA"`
            db.query(app, (err, result) => {
                if(err) throw err
                let room = `select users.name, doctor.room_no from users,doctor where users.id = (select doc_id from diseases where d_id = ${spe}) and doctor.doc_id = (select doc_id from diseases where d_id = ${spe})`
                db.query(room, (err, found) => {
                    if(err) throw err
                    //fee payment
                    let fee = `insert into bill set p_id = ${done[0].p_id}, p_doa = "${date}", bill_type = "consultancy_fee-${consultancy_fee}"`
                    db.query(fee, (err, paid) => {
                        if(err) throw err
                        req.flash('room', `Your Appointment is registered, PatientID: ${done[0].p_id} please proceed to Room.no: ${found[0].room_no} and Doctor: Dr. ${found[0].name} `)
                        res.redirect('/outPatient')
                    })
                })
            })
       }) 

    }else{
        //Appoint 
        let app = `insert into records set doa = "${date}", p_id = ${uniqueid}, d_id = ${spe}, prescription = "NA"`
        db.query(app, (err, result) => {
            if(err) throw err
            let room = `select users.name, doctor.room_no from users,doctor where users.id = (select doc_id from diseases where d_id = ${spe}) and doctor.doc_id = (select doc_id from diseases where d_id = ${spe})`
            db.query(room, (err, found) => {
                if(err) throw err
                //fee payment
                let fee = `insert into bill set p_id = ${uniqueid}, p_doa = "${date}", bill_type = "consultancy_fee-${consultancy_fee}"`
                db.query(fee, (err, paid) => {
                    if(err) throw err
                    req.flash('room', `Your Appointment is registered, please proceed to Room.no: ${found[0].room_no} and Doctor: Dr. ${found[0].name} `)
                    res.redirect('/outPatient')
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

//Doctor: Patient's Queue
var date 
router.post('/P_queue', (req, res) => {
     date = req.body.date
    //List of Patient's
    let queue = `select p_id, prescription from records where d_id = (select d_id from doctor where doc_id = ${req.user.id}) and doa = "${date}"`
    db.query(queue, (err, result) => {
        if(err) throw err
        let n = result.length
        if(n == 0) {
            req.flash('error', 'No Appointments Toady')
            res.redirect('/Doc_dash')
        }else {
            let string = ""
            for(let i=0;i<n-1;i++) {
                 string = string +`p_id = ${result[i].p_id} or `
            }
            string = string + `p_id = ${result[n-1].p_id}`
            let final = `select p_name, p_age from patient_info where ${string}`
            let lists = []
            db.query(final, (err, list) => {
                if(err) throw err
                lists.push(result)
                lists.push(list)
                req.flash('queue', lists)
                res.redirect('/Doc_dash')
            })
        }
    })
})

//Get Patient ID
var PatientID = 0;
router.post('/PatientID', (req, res) => {
    PatientID = req.body.PatientID
    let info = `(select p_id, p_name, p_age, p_gender, p_bloodgrp from patient_info where p_id=${PatientID})`
    let med = 'select m_name, l_name from medicines, Lab_tests where m_id = l_id'
    db.query(info, (err, result) => {
        if(err) throw err
        db.query(med, (err, meds) => {
            if(err) throw err
            let results = []
            results.push(result)
            results.push(meds)
            req.flash('info', results)
            res.redirect('/record')
        })
    })
})

//Doctor record Entry 
router.get('/record', (req, res) => {
    res.render('Doc_record', {
        name: req.user.name
    })
})

//Doctor record Entry Handle
router.post('/DocRecEntry', (req, res) => {
    var n = req.body.med_name.length
    var prescription = ""
    for(var i=0;i<n;i++){
        prescription = prescription + req.body.med_name[i] + '-' + req.body.quan[i] + ',' 
    } 
    // record entry
    let enter = `update records set meds = "${prescription}", prescription = "${req.body.desc}", LabTests = "${req.body.lab_name}" where p_id = ${PatientID} and doa = "${date}"`
    db.query(enter, (err, entry) => {
        if(err) throw err
        req.flash('record_entry', 'Entry Done')
        res.redirect('/Doc_dash')
    })
})

//Pharmacist 
router.get('/Pharmacy_dashboard', (req, res) => {
    res.render('Pharmacy_dashboard', {
        UserType: req.user.UserType
    })
})

//Pharmacist billing
router.get('/pharmacy', (req, res) => {
    let meds = 'select m_name, m_price, m_quantity from medicines'
    db.query(meds, (err, meds) => {
        if(err) throw err
        res.render('pharmacy_bill', {
            list: meds
        })
    })
})

//Pharmacy_PatientID
router.post('/PharmacyID', (req, res) => {
    const { PharmacyID, date } = req.body
    //Find ID
    let prescribed = `select patient_info.p_name, records.meds from records, patient_info where records.p_id = ${PharmacyID} and records.doa = "${date}" and patient_info.p_id = ${PharmacyID}`
    db.query(prescribed, (err, pres) => {
        if(err) throw err
        if(pres.length == 0) {
            req.flash('id', 'Please Check information')
            res.redirect('/pharmacy')
        }else {
            req.flash('prescription', pres)
            res.redirect('/pharmacy')
        }
    })
})

module.exports = router