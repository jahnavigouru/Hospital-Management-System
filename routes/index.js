const express = require('express')
const randomstring = require("randomstring");
const router = express.Router()
const { ensureAuthenticated } = require('../config/auth')

//DB 
const db = require('../app')
const { route } = require('./users')

//Welcome Page
router.get('/', (req, res) => res.render('welcome'))

const d = new Date();
const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
const mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d);
const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);    
var dayy = `${da}-${mo}-${ye}`;
  
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
    const { date, name, age, gender, DOB, BloodGrp, phone, address, email, patienttype } = req.body
    
    let P_errors = []

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
            let details = `insert into patient_info set p_dor="${date}",p_name="${name}",p_age=${age},p_gender="${gender}",p_dob="${DOB}",p_bloodgrp="${BloodGrp}",p_phn = "${phone}", p_addr="${address}",p_emailid="${email}", Registration = ${500}`
            db.query(details, (err, saved) => {
            if(err) throw err
            let id = `select p_id from patient_info where p_phn = "${phone}"`
            db.query(id, (err, userID) => {
                if(err) throw err
                if(patienttype == 'Out-Patient') {
                    let temp_success = []
                    temp_success.push({ msg: `You are have been successfully Registered with id_no: ${userID[0].p_id}`})
                    req.flash('P_success_msg', temp_success)
                    res.redirect('/outPatient')
                } else {
                    let temp_success = []
                    temp_success.push({ msg: `You are have been successfully Registered with id_no: ${userID[0].p_id}`})
                    req.flash('P_success_msg', temp_success)
                    res.redirect('/inPatient')
                }
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
    const opd_id = randomstring.generate(4)
        //Appoint 
        let app = `insert into records set doa = "${date}", p_id = ${uniqueid}, d_id = ${spe}, prescription = "NA", opd_id = '${opd_id}'`
        db.query(app, (err, result) => {
            if(err) throw err
            let room = `select users.name, doctor.room_no from users,doctor where users.id = (select doc_id from diseases where d_id = ${spe}) and doctor.doc_id = (select doc_id from diseases where d_id = ${spe})`
            db.query(room, (err, found) => {
                if(err) throw err
                //fee payment
                let fee = `insert into bill set opd_id = '${opd_id}', p_doa = "${date}", consultancy_fee=${consultancy_fee}`
                db.query(fee, (err, paid) => {
                    if(err) throw err
                    req.flash('room', `Your Appointment is registered with OPD_id = ${opd_id}, please proceed to Room.no: ${found[0].room_no} and Doctor: Dr. ${found[0].name} `)
                    res.redirect('/outPatient')
                })
            })
        })
})

//In-Patient
router.get('/inPatient', (req, res) => {
    let dis = 'select d_name, d_id from diseases, doctor where doctor.doc_id = diseases.doc_id'
    db.query(dis, (err, result) => {
        if(err) throw err
        //rooms
        let rooms = 'select beds.room_no, CONCAT( room.room_type, ", ", room.floor ) AS typefloor, beds.bed_no from room, beds where room.floor = beds.floor and beds.status = "Inactive"'
        let final = []
        db.query(rooms, (err, done) => {
            if(err) throw err
            final.push(result)
            final.push(done)
            res.render('inPatient', {
                finals: final,
                date_ip: dayy
            })
        })
    })
})

//InPatientID Allotment 
var inPatientID 
router.post('/inPatient', (req, res) => {
    inPatientID = req.body.inPatientID
    //find ID
    let patient = `select patient_info.p_id, p_name, p_age, p_gender, p_bloodgrp from patient_info where patient_info.p_id = ${inPatientID}`
    db.query(patient, (err, isMatch) => {
        if(err) throw err
        if(isMatch.length == 0){
            req.flash('id', 'Please Check information')
            res.redirect('/inPatient')
        }else{
            //Status
            let status = `select status from in_Patient_records where p_id = ${inPatientID}`
            db.query(status, (err, ans) => {
                if(err) throw err
                if(ans.length == 0 || ans[0].status == "Inactive") {
                    req.flash('InAllot', isMatch)
                    res.redirect('/inPatient')
                }else {
                    req.flash('id', 'You have been already alloted')
                    res.redirect('/inPatient')
                }
            })
        }
    })
})

//InPatientID Allotment Handle
router.post('/InRoom', (req, res) => {
    const ipd_id = randomstring.generate(6)
    const { date, d_id, typefloor, roombed } = req.body
    var res_roombed = roombed.split(",")
    var res_typefloor = typefloor.split(",")
    //ipd registration
     let ipd = `insert into in_Patient_records set doc = '${date}', p_id = ${inPatientID}, ipd_id = '${ipd_id}', d_id = ${d_id}, room_type = '${res_typefloor[0]}', floor = '${res_typefloor[1]}', room_no = ${res_roombed[0]}, bed_no = ${res_roombed[1]}, status = "Active"; update beds set status = "Active" where room_no = ${res_roombed[0]} and bed_no = ${res_roombed[1]}`
    db.query(ipd, (err, allot) => {
        if(err) throw err
        req.flash('room', `Your Allotment is registered, with IPD_ID: ${ipd_id}`)
        res.redirect('/outPatient')
    })
})

//IPD Section
router.get('/ipd_dash', (req, res) => {
    res.render('ipd_dash', {
        UserType: req.user.UserType
    })
})

//Meds update inPatient
router.get('/medsin', (req, res) => {
    res.render('medsInpatient', {
        datemeds: dayy
    })
})

//Meds update inPatient Handle
var ipd_med, date
router.post('/medsin', (req, res) => {
    ipd_med = req.body.ipd_id 
    date = req.body.date
    let med = 'select m_name from medicines'
    db.query(med, (err, medss) => {
        if(err) throw err
        //patient info
        let pat = `select p_name, p_age from patient_info where patient_info.p_id = (select p_id from in_Patient_records where ipd_id = '${ipd_med}')`
        let meds = []
        db.query(pat, (err, google) => {
            if(err) throw err
            if(google.length == 0) {
                req.flash('id', 'Please check your information')
                res.redirect('/medsin')
            } else {
                //check data 
                let data = `select Meds from dailyUpdates where ipd_id = '${ipd_med}' and date = '${date}'`
                db.query(data, (err, dot) => {
                    if(err) throw err
                    if(dot.length > 0) {
                        req.flash('id', 'Data is Already updated')
                        res.redirect('/medsin')
                    } else {
                        meds.push(medss)
                        meds.push(google)
                        req.flash('meds', meds)
                        res.redirect('/medsin')
                    }
                })
            }
        })
    })
})

//Enter in bill
router.post('/submitentry', (req, res) => {
    var n = req.body.med_name.length
    let string = ""
    for (let i = 0; i < n-1; i++) {
        string = string + req.body.med_name[i] + '-' + req.body.quantity[i] + ','
    }
    string = string + req.body.med_name[n-1] + '-' + req.body.quantity[n-1]
    //Update
    let sql = `insert into dailyUpdates set date = '${date}', ipd_id = '${ipd_med}', Meds = '${string}'`
    db.query(sql, (err, updated) => {
        if(err) throw err
        req.flash('success_msg', 'saved!')
        res.redirect('/medsin')
    }) 
})

//In-Patient
router.get('/inPatient', (req, res) => {
    let dis = 'select d_name, d_id from diseases, doctor where doctor.doc_id = diseases.doc_id'
    db.query(dis, (err, result) => {
        if(err) throw err
        //rooms
        let rooms = 'select beds.room_no, CONCAT( room.room_type, ", ", room.floor ) AS typefloor, beds.bed_no from room, beds where room.floor = beds.floor and beds.status = "Inactive"'
        let final = []
        db.query(rooms, (err, done) => {
            if(err) throw err
            final.push(result)
            final.push(done)
            res.render('inPatient', {
                finals: final,
                date_ip: dayy
            })
        })
    })
})

//InPatientID Allotment 
var inPatientID 
router.post('/inPatient', (req, res) => {
    inPatientID = req.body.inPatientID
    //find ID
    let patient = `select patient_info.p_id, p_name, p_age, p_gender, p_bloodgrp from patient_info where patient_info.p_id = ${inPatientID}`
    db.query(patient, (err, isMatch) => {
        if(err) throw err
        if(isMatch.length == 0){
            req.flash('id', 'Please Check information')
            res.redirect('/inPatient')
        }else{
            //Status
            let status = `select status from in_Patient_records where p_id = ${inPatientID}`
            db.query(status, (err, ans) => {
                if(err) throw err
                if(ans.length == 0 || ans[0].status == "Inactive") {
                    req.flash('InAllot', isMatch)
                    res.redirect('/inPatient')
                }else {
                    req.flash('id', 'You have been already alloted')
                    res.redirect('/inPatient')
                }
            })
        }
    })
})

//InPatientID Allotment Handle
router.post('/InRoom', (req, res) => {
    const ipd_id = randomstring.generate(6)
    const { date, d_id, typefloor, roombed } = req.body
    var res_roombed = roombed.split(",")
    var res_typefloor = typefloor.split(",")
    //ipd registration
     let ipd = `insert into in_Patient_records set doc = '${date}', p_id = ${inPatientID}, ipd_id = '${ipd_id}', d_id = ${d_id}, room_type = '${res_typefloor[0]}', floor = '${res_typefloor[1]}', room_no = ${res_roombed[0]}, bed_no = ${res_roombed[1]}, status = "Active"; update beds set status = "Active" where room_no = ${res_roombed[0]} and bed_no = ${res_roombed[1]}`
    db.query(ipd, (err, allot) => {
        if(err) throw err
        req.flash('room', `Your Allotment is registered, with IPD_ID: ${ipd_id}`)
        res.redirect('/outPatient')
    })
})

// Doctor dashboard
router.get('/Doc_dash', (req, res) => {
    res.render('Doc_dash', {
        name: req.user.name,
        specialization: req.user.specialization,
        datep: dayy
    })
})

//Doctor: Patient's Queue
var date 
router.post('/P_queue', (req, res) => {
     date = req.body.date
    //List of Patient's
    let queue = `select p_id, opd_id, prescription from records where doa = "${date}" and d_id = (select d_id from diseases where doc_id = ${req.user.id})  ORDER BY p_id ASC`
    db.query(queue, (err, result) => {
        if(err) throw err
        let n = result.length
        if(n == 0) {
            req.flash('error', 'No Appointments Toady')
            res.redirect('/Doc_dash')
        }else {
            let string = ""
            for(let i=n-1;i>0;i--) {
                 string = string +`p_id = ${result[i].p_id} or `
            }
            string = string + `p_id = ${result[0].p_id}`
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
var PatientID = "";
router.post('/PatientID', (req, res) => {
    PatientID = req.body.PatientID
    let info = `(select p_id, p_name, p_age, p_gender, p_bloodgrp from patient_info where p_id=(select p_id from records where opd_id = '${PatientID}'))`
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
    var n = req.body.length
    var prescription = ""
    if(!n) {
        prescription = prescription + req.body.med_name + '-' + req.body.mad + '-' + req.body.quantity
    } else{
    for(var i=0;i<n-1;i++){
        prescription = prescription + req.body.med_name[i] + '-' + req.body.mad[i] + '-' + req.body.quantity[i] + ', ' 
    } 
    prescription = prescription + req.body.med_name[n-1] + '-' + req.body.mad[n-1] + '-' + req.body.quantity[n-1] 
   }
    // record entry
    let enter = `update records set meds = "${prescription}", prescription = "${req.body.desc}", LabTests = "${req.body.lab_name}" where opd_id = '${PatientID}'`
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

//Inpatient Pharmacy
router.get('/inPharmacy', (req, res) => {
    res.render('inPatient_Pharmacy')
})

//Inpatient Pharmacy Handle 
var IPD
router.post('/inPharmacyID', (req, res) => {
    IPD = req.body.ipd_id
    //retrive details
    let details = `select date doa, Meds meds, meds_cost, m_name, m_price, m_quantity from dailyUpdates, medicines where ipd_id = '${IPD}'`
    db.query(details, (err, detail) => {
        if(err) throw err
        if(detail.length == 0) {
            req.flash('id', 'Please Check information')
            res.redirect('/inPharmacy')
        } else {
            if(detail[0].meds_cost) {
                req.flash('success_msg', `payment is already done`)
                res.redirect('/inPharmacy')
            } else {
                req.flash('prescription', detail)
                res.redirect('/inPharmacy')
            }
        }
    })
})

//Update of in_pahrmacy bill
router.post('/InpatienPaymentp', (req, res) => {
    var meds = "", totalprice = 0
    var n = req.body.med_name.length
    for(let i=0;i<n;i++){
        meds = meds + req.body.med_name[i] + '-' + req.body.quantity[i] + '-' + req.body.price[i] + ', '
        
        totalprice = totalprice + Number(req.body.price[i])
    }
    meds = meds + 'Total Price : Rs.' + totalprice
    //add
    let inbill = `update dailyUpdates set meds_cost = '${meds}' where ipd_id = '${IPD}' and date = '${req.body.DOA}'`
    db.query(inbill, (err, pay) => {
        if(err) throw err
        req.flash('success_msg', 'paid')
        res.redirect('/inPharmacy')
    })   
})

//Pharmacy_PatientID
var P_opd_id = ""
router.post('/PharmacyID', (req, res) => {
    P_opd_id  = req.body.opd_id
    //Find ID
    let prescribed = `select records.doa, records.meds, m_name, m_price, m_quantity from records, medicines where opd_id = '${P_opd_id}'`
    db.query(prescribed, (err, pres) => {
        if(err) throw err
        if(pres.length == 0) {
            req.flash('id', 'Please Check information')
            res.redirect('/pharmacy')
        }else {
            //check bill
            let pbill = `select bill_id, pharmacy_fee from bill where opd_id = '${P_opd_id}'`
            db.query(pbill, (err, pharm) => {
                if(pharm[0].pharmacy_fee) {
                    req.flash('success_msg', `payment is already done with bill_id: ${pharm[0].bill_id}`)
                    res.redirect('/pharmacy')
                }else {
                    req.flash('prescription', pres)
                    res.redirect('/pharmacy')
                }
            })
        }
    })
})

//Generation of pahrmacy bill
router.post('/PharmacyPayment', (req, res) => {
    var meds = "", totalprice = 0
    var n = req.body.length
    if(!n) {
        meds = meds + req.body.med_name + '-' + req.body.quantity + '-' + req.body.price
        
        totalprice = totalprice + Number(req.body.price)
    } else {
        for(let i=0;i<n;i++){
            meds = meds + req.body.med_name[i] + '-' + req.body.quantity[i] + '-' + req.body.price[i] + ', '
            
            totalprice = totalprice + Number(req.body.price[i])
        }    
    }
    meds = meds + ' Total Price : Rs.' + totalprice
    
    //Update bill
    let pharmbill = `update bill set pharmacy_fee = '${meds}' where opd_id = '${P_opd_id}'`
    db.query(pharmbill, (err, paid) => {
        if(err) throw err
        req.flash('success_msg', 'paid')
        res.redirect('/pharmacy')
    })
 })


//Lab fee
router.get('/labfee', (req, res) => {
    res.render('lab', {
        datep: dayy
    })
})

//In Patient Lab Entry
router.get('/inlabentry', (req, res) => {
    res.render('inlabentry', {
        datelabs: dayy
    })
})

//Enter Lab records
var ipd_lab, ldate
router.post('/labsin', (req, res) => {
    ipd_lab = req.body.ipd_id
    ldate = req.body.date
    let med = 'select l_name from lab_tests'
    db.query(med, (err, medss) => {
        if(err) throw err
        //patient info
        let pat = `select p_name, p_age from patient_info where patient_info.p_id = (select p_id from in_Patient_records where ipd_id = '${ipd_lab}')`
        let meds = []
        db.query(pat, (err, google) => {
            if(err) throw err
            if(google.length == 0) {
                req.flash('id', 'Please check your information')
                res.redirect('/inlabentry')
            } else {
                //check data 
                let data = `select labtests from dailyUpdates where ipd_id = '${ipd_lab}' and date = '${ldate}'`
                db.query(data, (err, dot) => {
                    if(err) throw err
                    if(dot[0].labtests) {
                        req.flash('id', 'Data is Already updated')
                        res.redirect('/inlabentry')
                    } else {
                        meds.push(google)
                        meds.push(medss)
                        req.flash('info', meds)
                        res.redirect('/inlabentry')
                    }
                })
            }
        })
    })
})

//Lab record entry 
router.post('/Inpatienlab', (req, res) => {
    const { lab_name } = req.body
    //update record
    let update = `update dailyUpdates set labtests = '${lab_name}' where date = '${ldate}' and ipd_id = '${ipd_lab}'`
    db.query(update, (err, up) => {
        if(err) throw err
        req.flash('success_msg', 'saved!')
        res.redirect('/inlabentry')
    })
})

//in patient lab fee post
router.get('/inlabfee', (req, res) => {
    res.render('inlabfee')
})

//inpatient lab fee details
var IPD_lab, Date_lab
router.post('/inlabfee', (req, res) => {
    IPD_lab = req.body.ipd_id
    Date_lab = req.body.date
    //check bill paid
    let check = `select labs_cost from dailyUpdates where ipd_id = '${IPD_lab}' and date = '${Date_lab}'`
    db.query(check, (err, checked) => {
        if(err) throw err
        if(checked.length == 0) {
            req.flash('id', 'Please Check information')
            res.redirect('/inlabfee')
        }else{
        if(checked[0].labs_cost) {
            req.flash('success_msg', `payment is already done`)
            res.redirect('/inlabfee')
        }else {
            // test consulted
            let tests = `select labtests from dailyUpdates where ipd_id = '${IPD_lab}' and date = '${Date_lab}'`
            db.query(tests, (err, lname) => {
                if(err) throw err
                if(lname.length == 0) {
                    req.flash('id', 'Please Check information')
                    res.redirect('/inlabfee')
                }else{
                    var name = lname[0].labtests.split(',')
                    var lab = ''
                    for (let i = 0; i < name.length; i++) {
                        lab = lab + `select l_cost, l_name from Lab_tests where l_name = '${name[i]}';`
                    }
                    db.query(lab, (err, result) => {
                        if(err) throw err
                        let labs = []
                        if(result.length == 1) {
                            labs.push(result)
                        }else{
                            labs = result
                        }
                        req.flash('pl', labs)
                        res.redirect('/inlabfee')
                    })
                }
            })
        }
      }
    }) 
})

//inlab fee pay
router.post('/inlabpay', (req, res) => {
    const { fee, total } = req.body
     //update lab bill
     let labbill = `update dailyUpdates set labs_cost = '${fee}, Total Cost : ${total}' where ipd_id = '${IPD_lab}' and date = '${Date_lab}'`
     db.query(labbill, (err, paid) => {
         if(err) throw err
         req.flash('success_msg', 'paid')
         res.redirect('/inlabfee')
     })
})

//lab fee post
var opd_id;
router.post('/labfee', (req, res) => {
    opd_id = req.body.opd_id
    //check bill paid
    let check = `select Lab_fee, bill_id from bill where opd_id = '${opd_id}'`
    db.query(check, (err, checked) => {
        if(err) throw err
        if(checked.length == 0) {
            req.flash('id', 'Please Check information')
            res.redirect('/labfee')
        }else{
        if(checked[0].Lab_fee) {
            req.flash('success_msg', `payment is already done with bill_id: ${checked[0].bill_id}`)
            res.redirect('/labfee')
        }else {
            // test consulted
            let tests = `select Labtests from records where opd_id = '${opd_id}'`
            db.query(tests, (err, lname) => {
                if(err) throw err
                if(lname.length == 0) {
                    req.flash('id', 'Please Check information')
                    res.redirect('/labfee')
                }else{
                    let lab = '', i, labname;
                    let previousIndex = 0; 
                    for (i = 0; i < lname[0].Labtests.length; i++) {
                        if(lname[0].Labtests[i] == ',') {
                            labname = lname[0].Labtests.slice(previousIndex, i)
                            lab = lab + `select l_cost, l_name from Lab_tests where l_name = '${labname}';`
                            previousIndex = i + 1;
                        }
                    }
                    labname =  lname[0].Labtests.slice(previousIndex, i)
                    lab = lab + `select l_cost, l_name from Lab_tests where l_name = '${labname}';`
                    db.query(lab, (err, result) => {
                        if(err) throw err
                        let labs = []
                        if(result.length == 1) {
                            labs.push(result)
                        }else{
                            labs = result
                        }
                        req.flash('pl', labs)
                        res.redirect('/labfee')
                    })
                }
            })
        }
      }
    }) 
})

//update lab bill 
router.post('/labpay', (req, res) => {
    const { fee, total } = req.body
     //update lab bill
     let labbill = `update bill set Lab_fee = '${fee}, Total Cost : ${total}' where opd_id = '${opd_id}'`
     db.query(labbill, (err, paid) => {
         if(err) throw err
         req.flash('success_msg', 'paid')
         res.redirect('/labfee')
     })
})
   
//lab_Dashboard
router.get('/laboratory', (req, res) => {
    res.render('laboratory', {
        UserType: req.user.UserType,
        datep: dayy
    })
})

//lab Date
router.post('/laboratory', (req, res) => {
    const { date } = req.body
    //get lab id's
    let info = `select p_id, opd_id, doa, Labreports from records where doa = '${date}'`
    db.query(info, (err, results) => {
        if(err) throw err
        var n = results.length
        if(n == 0) {
            req.flash('id', 'No appoints')
            res.redirect('/laboratory')
        } else {
            let string = ""
            for(let i=n-1;i>0;i--) {
                 string = string +`p_id = ${results[i].p_id} or `
            }
            string = string + `p_id = ${results[0].p_id}`
            let final = `select p_name, p_age from patient_info where ${string}`
            let lists = []
            db.query(final, (err, list) => {
                if(err) throw err
                lists.push(results)
                lists.push(list)
                req.flash('queuelab', lists)
                res.redirect('/laboratory')
            })
        }
    })
})

//Test entry
var labID
router.post('/labrecentry', (req, res) => {
    labID = req.body.P_opdid
    //select no.of records 
    let rec = `select opd_id, doa, LabTests from records where opd_id = '${labID}'`
    db.query(rec, (err, recs) => {
        if(err) throw err
        var tests = recs[0].LabTests.split(",")
        let array = []
        array.push(recs[0].opd_id)
        array.push(recs[0].doa)
        for(var i=0;i<tests.length;i++) {
            array.push(tests[i])
        }
        req.flash('array', array)
        res.redirect('/labtest')
    })
})

//Medical Tests
router.get('/labtest', (req, res) => {
    res.render('medical_tests')
})

//Update records (Lab reports)
router.post('/update', (req, res) => {
    const { date, tests } = req.body
    var report = ""
    report = report + date + ' _____ ' + tests
    let reports = `update records set Labreports = '${report}' where opd_id = '${labID}'`
    db.query(reports, (err, done) => {
        if(err) throw err
        req.flash('success_msg', 'Saved')
        res.redirect('/labtest')
    })
})

//in patient lab record entry get
router.get('/labrecordin', (req, res) => {
    res.render('labrecordin', {
        datep: dayy
    })
})

//lab Date
var datee
router.post('/labrecordin', (req, res) => {
    datee = req.body.date
    //get lab id's
    let info = `select ipd_id, date, labs_cost, labreports from dailyUpdates where date = '${datee}'`
    db.query(info, (err, results) => {
        if(err) throw err
        var n = results.length
        if(n == 0) {
            req.flash('id', 'No appoints')
            res.redirect('/labrecordin')
        } else {
            req.flash('inlabs', results)
            res.redirect('/labrecordin')   
        }
    })
})

// in Test entry
var inlabID
router.post('/inlabrecentry', (req, res) => {
    inlabID = req.body.P_opdid
    //select no.of records 
    let rec = `select ipd_id, labtests, date from dailyUpdates where ipd_id = '${inlabID}' and date = '${datee}'`
    db.query(rec, (err, recs) => {
        if(err) throw err
        var tests = recs[0].labtests.split(",")
        let array = []
        array.push(recs[0].ipd_id)
        array.push(recs[0].date)
        for(var i=0;i<tests.length;i++) {
            array.push(tests[i])
        }
        req.flash('array1', array)
        res.redirect('/labtest')
    })
})

//inUpdate records (Lab reports)
router.post('/inupdate', (req, res) => {
    const { date, tests } = req.body
    var report = ""
    report = report + date + ' _____ ' + tests
    let reports = `update dailyUpdates set labreports = '${report}' where ipd_id = '${inlabID}' and date = '${datee}'`
    db.query(reports, (err, done) => {
        if(err) throw err
        req.flash('success_msg', 'Saved')
        res.redirect('/labtest')
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
    var n = req.body.length
    var prescription = ""
    if(!n) {
        prescription = prescription + req.body.med_name+ '-' + req.body.mad + '-' + req.body.quantity
    }
    else {for(var i=0;i<n-1;i++){
        prescription = prescription + req.body.med_name[i] + '=' + req.body.mad[i] + '-' + req.body.quantity[i] + ', ' 
    } 
    prescription = prescription + req.body.med_name[n-1] + '=' + req.body.mad[n-1] + '-' + req.body.quantity[n-1] 
    }
    // record entry
    let enter = `update records set meds = "${prescription}", prescription = "${req.body.desc}", LabTests = "${req.body.lab_name}" where opd_id = '${PatientID}'`
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
var P_opd_id = ""
router.post('/PharmacyID', (req, res) => {
    P_opd_id  = req.body.opd_id
    //Find ID
    let prescribed = `select records.doa, records.meds, m_name, m_price, m_quantity from records, medicines where opd_id = '${P_opd_id}'`
    db.query(prescribed, (err, pres) => {
        if(err) throw err
        if(pres.length == 0) {
            req.flash('id', 'Please Check information')
            res.redirect('/pharmacy')
        }else {
            //check bill
            let pbill = `select bill_id, pharmacy_fee from bill where opd_id = '${P_opd_id}'`
            db.query(pbill, (err, pharm) => {
                if(pharm[0].pharmacy_fee) {
                    req.flash('success_msg', `payment is already done with bill_id: ${pharm[0].bill_id}`)
                    res.redirect('/pharmacy')
                }else {
                    req.flash('prescription', pres)
                    res.redirect('/pharmacy')
                }
            })
        }
    })
})

//Generation of pahrmacy bill
router.post('/PharmacyPayment', (req, res) => {
    var meds = "", totalprice = 0
    var n = req.body.length
    if(!n) {
        meds = meds + req.body.med_name + '-' + req.body.quantity + '-' + req.body.price
        totalprice = totalprice + Number(req.body.price)
    }
    else{
        for(let i=0;i<n;i++){
            meds = meds + req.body.med_name[i] + '-' + req.body.quantity[i] + '-' + req.body.price[i] + ', '
            
            totalprice = totalprice + Number(req.body.price[i])
        }
        meds = meds + 'Total Price : Rs.' + totalprice
    }
    //Update bill
    let pharmbill = `update bill set pharmacy_fee = '${meds}' where opd_id = '${P_opd_id}'`
    db.query(pharmbill, (err, paid) => {
        if(err) throw err
        req.flash('success_msg', 'paid')
        res.redirect('/pharmacy')
    })
 })


//Lab fee
router.get('/labfee', (req, res) => {
    res.render('lab', {
        datep: dayy
    })
})

//lab fee post
var opd_id;
router.post('/labfee', (req, res) => {
    opd_id = req.body.opd_id
    //check bill paid
    let check = `select Lab_fee, bill_id from bill where opd_id = '${opd_id}'`
    db.query(check, (err, checked) => {
        if(err) throw err
        if(checked.length == 0) {
            req.flash('id', 'Please Check information')
            res.redirect('/labfee')
        }else{
        if(checked[0].Lab_fee) {
            req.flash('success_msg', `payment is already done with bill_id: ${checked[0].bill_id}`)
            res.redirect('/labfee')
        }else {
            // test consulted
            let tests = `select Labtests from records where opd_id = '${opd_id}'`
            db.query(tests, (err, lname) => {
                if(err) throw err
                if(lname.length == 0) {
                    req.flash('id', 'Please Check information')
                    res.redirect('/labfee')
                }else{
                    let lab = '', i, labname;
                    let previousIndex = 0; 
                    for (i = 0; i < lname[0].Labtests.length; i++) {
                        if(lname[0].Labtests[i] == ',') {
                            labname = lname[0].Labtests.slice(previousIndex, i)
                            lab = lab + `select l_cost, l_name from Lab_tests where l_name = '${labname}';`
                            previousIndex = i + 1;
                        }
                    }
                    labname =  lname[0].Labtests.slice(previousIndex, i)
                    lab = lab + `select l_cost, l_name from Lab_tests where l_name = '${labname}';`
                    db.query(lab, (err, result) => {
                        if(err) throw err
                        let labs = []
                        if(result.length == 1) {
                            labs.push(result)
                        }else{
                            labs = result
                        }
                        req.flash('pl', labs)
                        res.redirect('/labfee')
                    })
                }
            })
        }
      }
    }) 
})

//update lab bill 
router.post('/labpay', (req, res) => {
    const { fee, total } = req.body
     //update lab bill
     let labbill = `update bill set Lab_fee = '${fee}, Total Cost : ${total}' where opd_id = '${opd_id}'`
     db.query(labbill, (err, paid) => {
         if(err) throw err
         req.flash('success_msg', 'paid')
         res.redirect('/labfee')
     })
})
   
//lab_Dashboard
router.get('/laboratory', (req, res) => {
    res.render('laboratory', {
        UserType: req.user.UserType,
        datep: dayy
    })
})

//lab Date
router.post('/laboratory', (req, res) => {
    const { date } = req.body
    //get lab id's
    let info = `select p_id, opd_id, doa, Labreports from records where doa = '${date}'`
    db.query(info, (err, results) => {
        if(err) throw err
        var n = results.length
        if(n == 0) {
            req.flash('id', 'No appoints')
            res.redirect('/laboratory')
        } else {
            let string = ""
            for(let i=n-1;i>0;i--) {
                 string = string +`p_id = ${results[i].p_id} or `
            }
            string = string + `p_id = ${results[0].p_id}`
            let final = `select p_name, p_age from patient_info where ${string}`
            let lists = []
            db.query(final, (err, list) => {
                if(err) throw err
                lists.push(results)
                lists.push(list)
                console.log(lists);
                req.flash('queuelab', lists)
                res.redirect('/laboratory')
            })
        }
    })
})

//Test entry
router.post('/labrecentry', (req, res) => {
    const { P_opdid } = req.body
    //select no.of records 
    let rec = `select opd_id, doa, LabTests from records where opd_id = '${P_opdid}'`
    db.query(rec, (err, recs) => {
        if(err) throw err
        var tests = recs[0].LabTests.split(",")
        let array = []
        array.push(recs[0].opd_id)
        array.push(recs[0].doa)
        for(var i=0;i<tests.length;i++) {
            array.push(tests[i])
        }
        req.flash('array', array)
        res.redirect('/labtest')
    })
})

//Medical Tests
router.get('/labtest', (req, res) => {
    res.render('medical_tests')
})


module.exports = router
