var express         = require("express");
var app             = express();
var mongoose        = require("mongoose");
var bodyParser      = require("body-parser");
var methodOverride  = require("method-override");
var flash           = require("connect-flash");

var passport = require("passport");
var LocalStrategy = require("passport-local");


//MODEL IMPORTS
var Poll = require("./models/poll.js");
var User = require("./models/user.js");


mongoose.connect('mongodb://localhost/voteapp');


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());



//PASSPORT
app.use(require("express-session")({
    secret: "Once Karabas wins!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//FUNCTION
function x(err){
    console.log(err);
}




//=====================================
//POLLS ROUTES
//=====================================

app.get("/", (req, res) =>{
    res.redirect("/polls");
});

app.get("/polls", (req, res) =>{
    Poll.find({}, (err, polls) =>{
        if(err){
            x(err);
        } else {
            res.render("index", {polls: polls});
        }
    });
    
});

app.post("/polls", (req, res) =>{
    req.body.polls.options = req.body.polls.options.split("\r\n");
    var options = [];
    req.body.polls.options.forEach((option) =>{
       options.push({
           name: option,
           voting: 0
       });
    });
    
    req.body.polls.options = options;
    
    Poll.create(req.body.polls, (err, polls) =>{
       if(err){
           x(err);
       } else {
           res.redirect("/");
       }
    });
});

app.get("/polls/new", (req, res) =>{
   res.render("new"); 
});

app.get("/polls/:id", (req, res) => {
    Poll.findById(req.params.id, (err, polls) => {
       if(err) {
           x(err);
       } else {
           res.render("poll", {polls: polls});
       }
    });
});

app.post("/polls/:id", (req,res) => {
    Poll.findById(req.params.id, (err, polls) => {
       if(err){
           x(err);
       } else {
           polls.options.forEach((option) => {
              if(option.name == req.body.selection){
                  option.voting++;
                  polls.save((err, newPoll) =>{
                      if(err){
                          x(err);
                      } else {
                          res.redirect("/polls/"+polls._id);
                      }
                  });
              }
           });
           
       }
    });
});


//============================
//USER ROUTES
//============================

app.get("/register", (req, res) => {
   res.render("register"); 
});

app.post("/register", (req, res) => {
    User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
        if(err) {
            x(err);
        } else {
            passport.authenticate("local")(req, res, () => {
                res.redirect("/polls");
            });
        }
    });
});

app.get("/login", (req, res) => {
   res.render("login"); 
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/polls",
    failureRedirect: "/login"
}),
(req, res) => {
    
});













//============================================
//LISTEN

app.listen(process.env.PORT, process.env.IP, () => {
   console.log("Server is ON!"); 
});