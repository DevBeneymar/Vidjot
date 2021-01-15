const LocalStrategy = require('passport-local').Strategy,
        mongoose = require('mongoose'),
        bcrypt = require('bcryptjs')
;

// 0- Start Load User Model 
require('../models/user');
const Userss=mongoose.model('users');
// End Load User Model

module.exports = ((passport)=>{
    passport.use(new LocalStrategy({usernameField:'email',passwordField:'password'},(email,password,done)=>{
        // Match user   
        Userss.findOne({email:email}).lean().exec((err,user)=>{
                if(!user){
                  return done(null, false, { message: 'No User Found!' });
                } 
                // Match password
                bcrypt.compare(password,user.password,(err,isMatch)=>{
                        if(err) throw err;
                        if(isMatch){
                            // console.log(user);
                             return done(null, user); 
                        }else{
                                return done(null, false, {message:'Incorrect password'});
                        }
                });
        });
    }));

    passport.serializeUser((user, done)=>{
        done(null, user._id);
    });

    passport.deserializeUser((id, done)=>{
        Userss.findById(id, (err, user)=>{
        done(err, user);
        });
    });

});