const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const User = require('./models/user');
const UserSymptom = require('./models/userSymptom');
const Video = require('./models/video')

const adminRoute = require('./routes/admin')

//mongodb://localhost/covid
// process.env.DATABASE 

mongoose.connect(process.env.DATABASE,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
    .then(()=>console.log("Connected"))
    .catch(err=>console.log("Can Not Connect to database"))

app.use('/admin',adminRoute);

app.use(express.urlencoded({extended:false}));
app.use(express.json());


app.get('/', (req, res) => {
    res.send('HomePage')
});

app.get('/login', (req, res) => {
    User.findOne({
        phone:req.query.phone,
    })
        .then(docs=>{
            if(docs){
                bcrypt.compare(req.query.password,docs.password,function(err,res1){
                    if(res1===true){
                        res.json(docs)
                    }
                 })
            }else{
                res.json('fail')
            }
        })
        .catch(err=>{
            res.json('Error Login')
        })
});

app.post('/signup',(req,res)=>{
    User.findOne({
        phone:req.body.phone,
    })
        .then(docs=>{
            if(docs)
                res.json("duplicate")
            else{
                bcrypt.hash(req.body.password,null,null,function(err,hash){
                    const user = new User({
                        username:req.body.username,
                        password:hash,
                        phone:req.body.phone
                    });
                    user.save()
                        .then(result=>{
                           const userSymptom = new UserSymptom({
                               id:result._id,
                               symptoms:[]
                           })
                           userSymptom.save()
                                .then(result1=>{
                                    res.json(result)
                                })
                        })
                        .catch(err=>{
                            res.json(err)
                        })
                })
            }
        })
        .catch(err=>{
           res.json('Error SignUp')
        })
})

app.get('/video',(req,res)=>{
    Video.find()
        .then(docs=>{
            res.json(docs)
        })
})

app.get('/userSymptom',(req,res)=>{
    UserSymptom.findOne({
        id:req.query.id
    })
        .then(docs=>{
            res.json(docs)
        })
})

app.post('/userSymptom',(req,res)=>{
    var d = new Date();
    UserSymptom.findOne({
        id:req.body.id
    })
        .then(doc=>{
           if(doc){
                const symptom={
                    date:d.toDateString(),
                    symptom: req.body.symptom
                }
                doc.username=req.body.username;
                doc.symptoms.push(symptom);
                doc.save()
                    .then(doc1=>res.json(doc1))
           }
        })
})

app.listen(process.env.PORT || 3000, () => {
    console.log('App Running');
});