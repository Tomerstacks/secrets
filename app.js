//jshint esversion:6
//jshint ejsversion:6
const express= require('express');
const app= express();
const bodyParser= require('body-parser');
const ejs= require('ejs');
const mongoose= require('mongoose');

const mongooseEncrypt= require('mongoose-encryption')

const bcrypt=require('bcrypt')
const saltRounds=10

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static('public'));

app.set('view engine', 'ejs');



const userSchema= new mongoose.Schema({
    name: String,
    password: String
})

const user= new mongoose.model('user', userSchema)




app.get('/', function(req, resp){
    resp.render('home.ejs');
})
app.get('/register', function(req, resp){
    resp.render('register');
})
app.get('/login', function(req, resp){
    resp.render('login');
})


app.post("/register", function(req, resp){

    async function registerUser(){

            
            try{

                bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
                    mongoose.connect("mongodb://0.0.0.0:27017/secretsDB")
                    var hashPass=hash
                    newUser= new user({
                        name: req.body.username,
                        password: hashPass
                    })
                    newUser.save()
                    resp.render('secrets');
                });

                

            }catch(err){
                console.log(err)
            }finally{
                await mongoose.connection.close()
            }

    }
    
    registerUser()
})

app.post("/login", function(req, resp){

    async function loginUser(){

        try{

                await mongoose.connect("mongodb://0.0.0.0:27017/secretsDB")

                const loggerMail= req.body.username
                const loggerPass= req.body.password
            
                const loggingUser= new user({
                    name: loggerMail,
                    password: loggerPass
                })

                const foundUser= await user.findOne({
                    name: loggingUser.name
                })

                if (foundUser){


                    bcrypt.compare(loggerPass, foundUser.password, function(err, result) {
                        if(result===true){
                            console.log("your password is correct")
                            resp.render('secrets')
                        }else{
                            console.log("There's something wrong with your password. Try again")
                        }
                    });

                }


        }catch(err){

                console.log(err)

        }finally{
            await mongoose.connection.close()
        }

    }

    loginUser();

})

app.listen(4000, function(){
    console.log('Server started on port 4000');
})



