const express=require('express');
const ejs=require('ejs');
const app=express();
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const db='mongodb+srv://abishchhetri2502:E4rz8WbOgI7Yd532@cluster0.gqrw9qd.mongodb.net/Welling?retryWrites=true&w=majority'
const session =require('express-session');
const passport=require('passport');
const passportLocalMongoose=require('passport-local-mongoose');


app.use(express.static(__dirname+'/public'));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}))

app.use(session({
    secret:"WeCareForOurCommunity.",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());


mongoose.connect(db).then(()=>{
    console.log('connected successful')}).catch((err)=>{
        console.log(err)
})

const userSchema=mongoose.Schema({
    firstName:{
        type:String
    },
    phoneNumber:{
        type:Number
    },
    email:{
        required:true,
        type:String
    },
    password:{
        type:String
    },
    messgae:{
        type:String
    }
},

{
    timestamps:true
})

userSchema.plugin(passportLocalMongoose)

const User=new mongoose.model('user', userSchema);
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/Questions",(req,res)=>{
    // console.log(req.isAuthenticated())
    // if(req.isAuthenticated()){
    //     res.render('Questions');
    // }
    // else{
    //     res.redirect('/login')
    // }
   res.render('Questions');
})

app.get("/login",(req,res)=>{
    res.render('login');
})



app.get("/",(req,res)=>{
    res.render('index');
})

// post method starts here

app.post("/register",async(req,res)=>{
    console.log('This is for register',req.body);
    
    try{
        const userSave=new User({
            firstName:req.body.fullName,
            phoneNumber:req.body.phoneNumber,
            email:req.body.email,
            password:req.body.password
            
        })
        console.log(userSave)

        userSave.save()

    }
    catch(err){
        console.log(err)
    }

//     User.register(
//         new User({
//             username: req.body.email,
//             email:req.body.email,
//             phoneNumber: req.body.phoneNumber,
//             fullname: req.body.fullName,
//           }),
//           req.body.password,
//         function(err, user){
//         if(err){
//             console.log(err);
//             res.redirect("/login");
//         }else{
//             passport.authenticate('local')(req,res, function(){
//                 console.log(user)
//                 res.redirect('/Questions')
//             })
//         }
//     })
})

app.post("/login",async(req,res)=>{
    console.log('This is for login:',req.body)

    const result=await User.findOne({email:req.body.email});
    console.log(result)
    if(!result)
     {console.log(" Not resgistered ");
      res.redirect(`/login`)}
    else { 
        if(req.body.password==result.password){
            res.redirect('/Questions')
        }
        else{
            console.log("Wrong Password")
            res.redirect("/login")
        }
    } 
})


app.post('/Questions',(req,res)=>{
    console.log(req.body);

    const scores = req.body;

    let sum = 0;
    for (const key in scores) {
        if (scores.hasOwnProperty(key)) {
            sum += parseInt(scores[key]);
        }
    }

    console.log(sum);

    if(sum>=16){
        res.status(200).json({ message: "Your are healthy"});
    }
    else if(sum>=12 && sum<=16){
        res.status(200).json({ message: "You need a little bit of focus in your routine."});
        
    }
    else if(sum>=8 && sum <=12){
        res.status(200).json({ message: "You need to focus more on your life style and food habits"});

    }

    else{
        res.status(200).json({ message: "You need to visit a medical professional."});

    }

     
 
    
})
app.listen(3000,function(){
    console.log("Server at 3000");
})

