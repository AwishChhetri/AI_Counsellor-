const express=require('express');
const ejs=require('ejs');
const app=express();
const serverless = require('serverless-http');
const cookieParser=require('cookie-parser');
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const db="mongodb+srv://abishchhetri2502:5RedEYg7DsGaIdEA@cluster0.we93acd.mongodb.net/Welling?retryWrites=true&w=majority"
const jwt=require('jsonwebtoken')
const PORT= process.env.PORT || 8080
secretKey="HelloEveryOne"
app.use(express.static(__dirname+'/public'));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}))
app.use(cookieParser());
app.use(express.json())





mongoose.connect(db).then(()=>{
    console.log('connected successful')}).catch((err)=>{
        console.log(err)
})
// mongoose.set('useCreateIndex',true);

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
});



const User=new mongoose.model('user', userSchema);



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
        res.redirect('/login')

    }
    catch(err){
        console.log(err)
    }



})

const checkAuth = (req, res, next)=> {
    const authHeader = req.cookies.__token;
    console.log(authHeader,'authHeader');
    const token = req.cookies.__token;
    if(!token){
        res.redirect("/login")
        return false
    }
    jwt.verify(token, secretKey, async(err,decoded) => {
        if(err) throw err;
        console.log(decoded)
        if(decoded.ID){
            await User.findOne({
                _id:decoded.ID
            }).then((response)=>{
                console.log(response,'response')
                req.user=response;
                next()
            }).catch((errs)=>{
                console.log(errs)
            })
        }else{
            res.send('Invalid signature');
            return redirect('/login')
        }
   
   
    })
  }


  app.get("/Account",checkAuth,(req,res)=>{
    console.log("louuuuuuuu",req.user);
    if(req.user){
        console.log("this is question route",req.user.firstName)
        // res.render("secrets",{Fname:req.user.firstname,
        //     Lname:req.user.lastname,
        //     Email:req.user.email,
        //     Age:req.user.Age,
        //     Image:req.user.image,
        // });
        res.render('account',{name:req.user.firstName, email:req.user.email, phone:req.user.phoneNumber});

    }else{
        res.redirect('/login')
    }
   
   
})

app.get("/Questions",checkAuth,(req,res)=>{
    console.log("louuuuuuuu",req.user);
    if(req.user){
        console.log("this is question route",req.user.firstName)
        // res.render("secrets",{Fname:req.user.firstname,
        //     Lname:req.user.lastname,
        //     Email:req.user.email,
        //     Age:req.user.Age,
        //     Image:req.user.image,
        // });
        res.render('Questions',{name:req.user.firstName, email:req.user.email, phone:req.user.phoneNumber});

    }else{
        res.redirect('/login')
    }
   
   
})


app.post("/login",async(req,res)=>{
    console.log('This is for login:',req.body)

    const result=await User.findOne({email:req.body.email});
   
    console.log(result)
    if(!result)
     {console.log(" Not resgistered ");
      res.redirect(`/login`)}
    else { 
        const token = jwt.sign({ID:result._id}, secretKey, { expiresIn: '1h' });
                console.log(`Hence the generated token:${token}`);
                res.cookie('__token',token);
                // console.log(res);
                res.redirect('/Account');

    } 

    // const user=new User({
    //     username:req.body.email,
    //     passpord:req.body.passpord
    // })
// console.log(user)
    // req.login(user,function(err){
    //     if(err){
    //         console.log(err);
    //     }
    //     else{
    //         passport.authenticate("local")(req,res,function(){
    //             console.log(user)
    //             res.redirect("/Questions")
    //         })
    //     }
    // })
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
        res.status(200).json({ message: "You didnot make the choice"});

    }

     
 
    
})
app.listen(PORT,function(){
    console.log("Server at 3000");
})

module.exports.expressApp = serverless(app);