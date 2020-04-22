const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const User = require('./models/user');

const adminRoute = require('./routes/admin')

//mongodb://localhost/covid

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
        phone:req.body.phone,
    })
        .then(docs=>{
            if(docs){
                bcrypt.compare(req.body.password,docs.password,function(err,res1){
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
                           res.json(result)
                        })
                        .catch(err=>{
                            return err
                        })
                })
            }
        })
        .catch(err=>{
           res.json('Error SignUp')
        })
   
})

app.listen(process.env.PORT || 3000, () => {
    console.log('App Running');
});