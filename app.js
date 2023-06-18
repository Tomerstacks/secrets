//jshint esversion:6
//jshint ejsversion:6
require('dotenv').config()//Required for working with dotenv...environment variables.


const express= require('express');
const app= express();
const bodyParser= require('body-parser');
const ejs= require('ejs');
const mongoose= require('mongoose');

const mongooseEncrypt= require('mongoose-encryption')
app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static('public'));

app.set('view engine', 'ejs');



// console.log(process.env.SECRET)c
const secret= process.env.SECRET

const userSchema= new mongoose.Schema({
    name: String,
    password: String
})

userSchema.plugin(mongooseEncrypt, { secret: secret , encryptedFields: ['age'] } );

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
                await mongoose.connect("mongodb://localhost:27017/secretsDB")
                const newUser= new user({
                    name: req.body.username,
                    password: req.body.password
                })
                await newUser.save()
                resp.render('secrets');
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

                await mongoose.connect("mongodb://localhost:27017/secretsDB")

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
                    if(loggingUser.password===foundUser.password){
                        resp.render('secrets')
                    }
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



