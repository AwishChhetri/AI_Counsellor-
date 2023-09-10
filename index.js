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



mongoose.connect(process.env.uri).then(()=>{
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
    res.clearCookie();
    res.redirect('/')
})

app.get("/login",(req,res)=>{
    res.render('login');
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
        { role: 'user', content: 'I have been feeling extremely anxious lately. Can you provide some tips for managing anxiety?' },
        { role: 'assistant', content: 'I understand that dealing with anxiety can be challenging. Here are some tips that might help:' },
      ];
      ans = await getPrompt(message);
      updatedb(ans);
      res.redirect('/Account')
    
    
  } else if (sum >= 12 && sum <= 16) {
   
    const message = [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'I have been feeling extremely anxious lately. Can you provide some tips for managing anxiety?' },
        { role: 'assistant', content: 'I understand that dealing with anxiety can be challenging. Here are some tips that might help:' },
      ];;
      ans = await getPrompt(message);
      updatedb(ans);
      res.redirect('/Account')
  } 
  
  
  
    else if (sum >= 8 && sum <= 12) {
    const message= [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'I have been feeling extremely anxious lately. Can you provide some tips for managing anxiety?' },
        { role: 'assistant', content: 'I understand that dealing with extreme anxiety can be very challenging. First, I want to acknowledge your feelings and let you know that you are not alone in this. Would you like to share more about what is been causing this extreme anxiety or any specific situations that trigger it?' },
      ];
      ans = await getPrompt(message);
      updatedb(ans);
      res.redirect('/Account')
  } else {
    const message = [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'I have been feeling extremely anxious lately. Can you provide some tips for managing anxiety?' },
        { role: 'assistant', content: 'I understand that dealing with anxiety can be challenging. Here are some tips that might help:' },
        { role: 'assistant', content: '1. Practice deep breathing exercises to calm your mind.' },
        { role: 'assistant', content: '2. Consider talking to a mental health professional for support.' },
        { role: 'assistant', content: '3. Engage in regular physical activity to reduce stress.' },
        { role: 'assistant', content: '4. Try mindfulness meditation to stay grounded in the present moment.' },
        { role: 'user', content: 'What can I do to stay motivated while managing my anxiety?' },
      ];
      ans = await getPrompt(message);
      updatedb(ans);
      res.redirect('/Account')
  }

});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});