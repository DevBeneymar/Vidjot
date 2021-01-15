const express = require('express'),
      router = express.Router(),
      mongoose= require('mongoose'),
      {ensureAuthenticated}= require('../helpers/auth') // Load Helper
    //   methodOverride = require('method-override')
;


// Load Ideas Model
require('../models/Idea');
const Ideass = mongoose.model('ideas');

//Index Ideas Page
router.get('/',ensureAuthenticated,(req,res)=>{
    // Ideass.find({})
    //     .sort({date:'desc'})
    //     .then((ideas)=>{
    //         console.log(ideas);
    //         res.render('ideas/index',{
    //             ideas:ideas
    //         });
    //     });
    Ideass.find({user:req.user.id}).sort({date:-1}).lean().exec((err,ideas)=>{
        if(err) throw err;
        // console.log(req.user);
        // req.flash('success_msg','Bienvenue');
        res.render('ideas/index',{ 
            ideas:ideas,
            titre:'My Ideas',
            name:req.user.name
        });
    });
});

//Form add idea
router.get('/add',ensureAuthenticated,(req,res)=>{
    const title ='Add-Ideas';
    res.render('ideas/add',{
        titre:title,
        name:req.user.name
    });
});

// Edit Idea Form
router.get('/edit/:id',ensureAuthenticated,(req,res)=>{
    const ideasEdit = Ideass.findOne({_id:req.params.id}).lean().exec((err,ideas)=>{
        // console.log(ideas.title);
        if(ideas.user !=req.user.id){
            req.flash('error_msg','Not Authorized!');
            res.redirect('/ideas');
        }
        else{
            res.render('ideas/edit',{
                ideas:ideas,
                titre:ideas.title,
                name:req.user.name
            });
        }
    });
});

// Method PUT: for update IDEA
// 1-Process Edit form for update idea
router.put('/:id',ensureAuthenticated,(req,res)=>{
    let errors=[];
    if(!req.body.title){
        errors.push({
            text:"Title can\'t empty!"
        });
    }
    if(!req.body.details){
        errors.push({
            text:"Details can\'t empty!"
        });
    }
    if(errors.length>0){
        Ideass.findOne({_id:req.params.id}).lean().exec((err,idea)=>{
            res.render('ideas/edit',{
                errors:errors,
                ideas:idea
            });
        });
    }
    else{
        Ideass.findOne({_id:req.params.id}).exec((err,idea)=>{
            if(err) throw err;
            idea.title= req.body.title;
            idea.details = req.body.details;
            idea.save().then(()=>{
                req.flash('success_msg','Video Idea Updated!');
                res.redirect('/ideas');
            });
        });
        
    }
});

// 2- Process Form
router.post('/add',ensureAuthenticated,(req,res)=>{
    let errors = [];
    if(!req.body.title){
        errors.push({
            text:'Please add a title'
        });
    }
    if(!req.body.details){
        errors.push({
            text:'Please add details'
        });
    }
    if(errors.length>0){
        res.render('ideas/add',{
            errors:errors,
            titre: req.body.title,
            details:req.body.details
        });
    }else{
        const newIdea = {
            title: req.body.title,
            details:req.body.details,
            user:req.user.id
        };
        const MyIdea = new Ideass(newIdea);
        MyIdea.save().then(()=>{
            req.flash('success_msg','Video Idea Added!');
            res.redirect('/ideas/');
        });
    }
    
});
// End save idea


// Method DELETE for delete idea
router.delete('/:id',ensureAuthenticated,(req,res)=>{
    // premiere Facon
    // Ideass.remove({_id:req.params.id}).then(()=>{
    //     res.redirect('/ideas');
    // });
    // deuxieme Facon
        Ideass.findOne({_id:req.params.id},(err,choz)=>{
            if(err) throw err;
            choz.remove((err)=>{
                if(err) throw err;
                // res.json({ message: 'Successfully deleted' });
                req.flash('success_msg','Video Idea removed!');
                res.redirect('/ideas');
            });
        });
});

module.exports = router;