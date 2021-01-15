const express = require('express'),
      router = express.Router(),
      mongoose = require('mongoose'),
      bcrypt = require('bcryptjs'),
      passport = require('passport')
;

// 0- Start Load Users model
require('../models/user');
const Userss = mongoose.model('users');
// End Load model

// 1- User Login route
router.get('/login',(req,res)=>{
    res.render('users/login',{
        titre:'Login'
    });
});
// End User Login route

// 2- Start Login Process form post
router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect:'/ideas',
        failureRedirect:'/users/login',
        // successFlash: 'Succesfull!',
        failureFlash:true
    })(req,res,next);
});
// End Login Process form post login

// 3- Start User Register Route
router.get('/register',(req,res)=>{
    res.render('users/register',{
        titre:"Register"
    });
});
// End User register route

// 4- Start Register Form POST
router.post('/register',(req,res)=>{
    let errors = [];
    if(!req.body.name){
        errors.push({text:'Please add Name!'});
    }
    if(!req.body.email){
        errors.push({text:'Please add Email!'});
    }
    if(!req.body.password){
        errors.push({text:'Please add Password!'});
    }
    if(!req.body.password2){
        errors.push({text:'Please Confirm Password!'});
    }
    if(req.body.password != req.body.password2){
        errors.push({text:'Passwords don\'t match'});
    }
    if(req.body.password.length < 4){
        errors.push({text:'Password must be at least 4 characters'});
    }
    if(errors.length > 0){
        res.render('users/register',{
            errors:errors,
            name:req.body.name,
            email:req.body.email,
            password:req.body.password,
            password2:req.body.password2
        });
    }
    else{
            Userss.findOne({email:req.body.email}).lean().exec((err,user)=>{
                // if(err) throw err;
                if(user){
                    req.flash('error_msg','Email already registered');
                    res.redirect('/users/register');
                }
                else{
                    const newUser = new Userss({
                        name:req.body.name,
                        email:req.body.email,
                        password:req.body.password
                    });
                    //Crypt password and insert in database
                    bcrypt.genSalt(10,(err,salt)=>{
                        bcrypt.hash(newUser.password,salt,(err,hash)=>{
                            if(err) throw err;
                            newUser.password=hash;
                            // Insert data
                            newUser.save().then(()=>{
                                req.flash('success_msg','You are registered and can log in now');
                                res.redirect('/users/login');
                            });
                        });
                    });
                    // End Crypt and insert in database
                }
            });
            
    }
});
// End register form

// 5- Start Logout User
router.get('/logout',(req,res)=>{
    const nom = req.user.name;
    req.logout();
    req.flash('success_msg',nom+' You are logged out!');
    res.redirect('/users/login');
});
// End Logout User
module.exports = router;