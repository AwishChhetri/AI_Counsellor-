const express=require('express');
const ejs=require('ejs');
const app=express();
const env=require('dotenv')
const OpenAI = require('openai');
const serverless = require('serverless-http');
const cookieParser=require('cookie-parser');
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const jwt=require('jsonwebtoken')
const PORT= process.env.PORT || 8080
const { AbortController } = require('abort-controller');
app.use(express.static(__dirname+'/public'));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}))
app.use(cookieParser());
app.use(express.json())

require('dotenv').config();



mongoose.connect("mongodb+srv://abishchhetri2502:5RedEYg7DsGaIdEA@cluster0.we93acd.mongodb.net/Welling?retryWrites=true&w=majority",{ useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
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
    message:{
        type:String,
        default:"You haven't taken the test!"
    }

},

{
    timestamps:true
});



const User=new mongoose.model('user', userSchema);

app.get("/logout",(req,res)=>{
    res.clearCookie(`__token`);
    res.redirect('/')
})

app.get("/login",(req,res)=>{
    res.render('login');
})

app.get("/face",(req,res)=>{
    res.render('faceDetection');
})





app.get("/",(req,res)=>{
    res.render('index');
})

// post method starts here

app.post("/register",async(req,res)=>{
    
    try{
        const userSave=new User({
            firstName:req.body.fullName,
            phoneNumber:req.body.phoneNumber,
            email:req.body.email,
            password:req.body.password
            
        })

        userSave.save()
        res.redirect('/login')

    }
    catch(err){
        console.log(err)
    }



})

const checkAuth = (req, res, next)=> {
    const authHeader = req.cookies.__token;
    const token = req.cookies.__token;
    if(!token){
        res.redirect("/login")
        return false
    }
    jwt.verify(token, process.env.secretKey, async(err,decoded) => {
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
    if(req.user){
       
        res.render('account',{name:req.user.firstName, email:req.user.email, phone:req.user.phoneNumber, message:req.user.message});

    }else{
        res.redirect('/login')
    }
   
   
})

app.get("/Questions",checkAuth,(req,res)=>{
    if(req.user){
        
        res.render('Questions',{name:req.user.firstName, email:req.user.email, phone:req.user.phoneNumber});

    }else{
        res.redirect('/login')
    }
   
   
})


app.post("/login",async(req,res)=>{

    const result=await User.findOne({email:req.body.email});
   
    if(!result)
     {
      res.redirect(`/login`)}
    else { 
        const token = jwt.sign({ID:result._id}, process.env.secretKey, { expiresIn: '30d' });
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



const openai = new OpenAI({
  apiKey: `${process.env.API_URL}`,
});

async function getPrompt(prompt) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: prompt,
      temperature: 0.6,
      max_tokens: 200,
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

app.use(express.json());

app.post('/Questions',checkAuth, async (req, res) => {
    //Update the Adive 
    
    const updatedb=async(ans)=>{
         await User.updateOne(
            { _id: req.user._id },
            { $set: { message: ans } }
        )
        .then((result) => {
            console.log(`updated`);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }       
  
    //calculating the score
  const scores = req.body;
  let sum = 0;

  for (const key in scores) {
    if (scores.hasOwnProperty(key)) {
      sum += parseInt(scores[key]);
    }
  }

  console.log(sum);

  let ans = '';

  if (sum >= 16) {
    // Initial phase of anxiety
    const message = [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'I need tips on mental health?' },
        { role: 'assistant', content: 'It seems like you are in good mental health, which is wonderful to hear. However, remember that mental health can fluctuate, so its essential to continue practicing self-care and reach out for support if you ever feel the need. Keep up the positive attitude' },
      ];
      ans = await getPrompt(message);
      updatedb(ans);
      res.redirect('/Account')
    
    
  } else if (sum >= 12 && sum <= 16) {
   
    const message = [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'I need tips on mental health?' },
        { role: 'assistant', content: `It appears that you may be experiencing some mild mental health symptoms. It's important to acknowledge these feelings and consider seeking support. Remember, reaching out to friends, family, or a mental health professional can make a significant difference in how you feel`},
      ];;
      ans = await getPrompt(message);
      updatedb(ans);
      res.redirect('/Account')
  } 
  
  
  
    else if (sum >= 8 && sum <= 12) {
    const message= [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'I need tips on mental health?' },
        { role: 'assistant', content: `Your responses indicate that you may be dealing with moderate mental health symptoms. It's essential to prioritize your well-being and consider speaking with a mental health professional. They can provide guidance and support to help you manage these challenges.` },
      ];
      ans = await getPrompt(message);
      updatedb(ans);
      res.redirect('/Account')
  } else {
    const message = [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'I need tips on mental health?' },
        { role: 'assistant', content: `Your answers suggest that you are facing severe mental health symptoms. It's crucial to seek immediate help and not face these challenges alone. Reach out to a mental health professional, a trusted friend, or a helpline right away. You don't have to go through this on your own, and there is support available` },
       
      ];
      ans = await getPrompt(message);
      updatedb(ans);
      res.redirect('/Account')
  }

});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});