const express = require('express')
const router = express.Router();
const crypt = require('bcryptjs')

const User = require('../../Model/user');

router.post('/register',async (req,res)=>{
    //console.log('inside register');
    var userexists = await User.findOne({email:req.body.email});
    if(userexists){
        res.status(400).json({
            code:400,
            message:'Email is already taken!',
            data:null,
            status: false
        })
    }
    const salt = await crypt.genSalt(10);
    const hashpassword = await crypt.hash(req.body.password,salt);

    const usr = new User({
        firstname:req.body.firstname,
        lastname:req.body.lastname,
        username:req.body.firstname,
        email:req.body.email,
        password:hashpassword,
        phone:req.body.phone,
        gender:req.body.gender,
        role:req.body.role
    });

    try{
        var response = await usr.save();
        res.status(200).json({
            code:200,
            message:'Registration Successfull!',
            data:response,
            status: true
        })
    } catch(err) {
        res.status(500).json({
            message:err,
            status:false,
            code:500,
            data: null
        })
    }
})

module.exports = router