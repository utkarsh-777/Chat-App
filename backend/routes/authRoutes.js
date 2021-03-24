const express = require('express');
const User = require('../models/User');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {SECRET} = require("../keys");
const requireLogin = require('../middlewares/requireLogin');

router.post('/signup',(req,res)=>{
    const {name,email,password} = req.body;
    if(!name || !email || !password){
        return res.status(401).json({
            error:"Provide all credentials!"
        });
    }

    User.findOne({email:email})
        .then(user => {
            if(user) {
                return res.status(422).json({
                    error:'You are already registered kindly login!'
                })
            }
            bcrypt.hash(password,12)
                .then(hashedpassword=>{
                    const newuser = new User({
                        name,
                        email,
                        password:hashedpassword
                    })
                    newuser.save()
                        .then(
                            res.json({
                                name,
                                email
                            }) 
                        )
                })
        })
});

router.post('/login',(req,res)=>{
    const {email,password} = req.body;
    User.findOne({email:email})
        .then(user=>{
            if(!user){
                return res.status(422).json({
                    error:"Email not registered signup first!"
                })
            }
            bcrypt.compare(password,user.password)
                .then(match=>{
                    if(match){
                        const token = jwt.sign({email:user.email,name:user.name},SECRET);
                        const {name,email,followers,following} = user;
                        return res.json({
                            user:{
                            name,
                            email
                            },
                            token:"Bearer "+token
                        })
                    }
                    else{
                        return res.status(422).json({
                            error:"Invalid username or password!"
                        })
                    }
                })
                .catch(err=>console.log(err))
        }).catch(err=>console.log(err))
});

router.get('/get-user',requireLogin,(req,res)=>{
    if(req.user){
    const {_id,name,email,createdAt,updatedAt} = req.user;
    return res.json({_id,name,email,createdAt,updatedAt});
    }
    else{
        console.log("User not logged in!")
    }
})

module.exports = router;