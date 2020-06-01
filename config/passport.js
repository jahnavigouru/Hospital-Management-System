const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const mysql = require('mysql');

//DB 
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'hospital_management'
})

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email', passReqToCallback : true }, function (req, email, password, done)  {
            //Match User
                let check = `select * from users where email = "${email}"`
                db.query(check, (err, match) => {

                if(err) throw err
                if(match.length == 0) {
                    return done(null, false, { message: `${email} is not registered` })
                }
                //Match Password
                bcrypt.compare(password, match[0].password, (err, isMatch) => {
                    if(err) throw err
                    if(isMatch) {
                        return done(null, match[0])
                    }else {
                        return done(null, false, { message: 'Password Incorret' })
                    }
                })
            })
        })
    ) 
    
    passport.serializeUser((user, done) => {
        done(null, user.id);
      })    
      passport.deserializeUser((id, done) => {
           let sql = `select * from users where id = ${id}`
           db.query(sql, (err, result) => {

               done(err, result[0])
           })
      })  
}