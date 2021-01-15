const express = require('express'),
        app = express(),
        path = require('path'),
        port = process.env.PORT || 3000,
        exphbs = require('express-handlebars'),
        methodOverride = require('method-override'),
        flash= require('connect-flash'),
        session = require('express-session'),
        mongoose= require('mongoose'),
        bodyParser= require('body-parser'),
        passport = require('passport')
;   

// Map global Promise - get rid of warning
// mongoose.Promise = global.Promise;

// Load routes
const ideas =require('./routes/ideas'), //Routes for link ideas
      users = require('./routes/users')
;

// Passport Config
require('./config/passport')(passport);
// DB config
const db = require('./config/database');

// Debut Connection database online : Connect to mongoose
mongoose.connect(db.mongoURI,{
    // useMongoClient:true
     keepAlive: 1,
     useNewUrlParser: true, //remove this code
     useUnifiedTopology: true
})
.then(()=>{
    console.log('MongoDB Connected...');
})
.catch((err)=>{
    console.log(err);
});
// Fin connection database online
/*
// Debut Connection database local : Connect to mongoose
mongoose.connect('mongodb://localhost/vidjot-dev',{
    // useMongoClient:true
     keepAlive: 1,
     useNewUrlParser: true, //remove this code
     useUnifiedTopology: true
})
.then(()=>{
    console.log('MongoDB Connected...');
})
.catch((err)=>{
    console.log(err);
});
// Fin connection database local
*/

// middleware Express-handlebar : Pour la gestion du template
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine','handlebars'); //On definit le moteur de template

 //Gestion des fichiers static: Static folder
// app.use('/assets',express.static('public')); 1) premiere facon
app.use('/assets',express.static(path.join(__dirname,'public'))); //2e facon

//#########################Pour_nous_permettre_de_prendre_les_donnees: bodyparser Middleware: ###################
 
// 1- parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// var urlencodedParser = bodyParser.urlencoded({ extended: false })

// 2- parse application/json
app.use(bodyParser.json());

//##################################################################################################

// 3- //Method Override Middleware : override with POST having ?_method=PUT
app.use(methodOverride('_method'));

// Express session middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
  //cookie: { secure: true }
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use(require('./middlewares/flash'));
/*
// Global variables
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});
*/
//Index Route
app.get('/',(req,res)=>{
    const title =  'Welcome';
    res.render('index',{
        titre:title,
        name: req.user ? req.user.name : null
    });
});

// About Route
app.get('/about',(req,res)=>{
    const title ='About';
    res.render('about',{
        titre:title,
        name: req.user ? req.user.name : null
    });
});

// Use route
app.use('/ideas',ideas);
app.use('/users',users);

//Port d'ecoute
app.listen(port,()=>{
    console.log('Server is Starting au port: '+port);
    // console.log(process.env.PORT);
});