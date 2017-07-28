var express         = require("express");
var app             = express();
var mongoose        = require("mongoose");
var bodyParser      = require("body-parser");
var methodOverride  = require("method-override");


mongoose.connect('mongodb://localhost/voteapp');


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

//
function x(err){
    console.log(err);
}

//MODEL IMPORTS
var Poll = require("./models/poll.js");


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














//============================================
//LISTEN

app.listen(process.env.PORT, process.env.IP, () => {
   console.log("Server is ON!"); 
});