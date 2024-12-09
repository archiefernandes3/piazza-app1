const express = require('express');
const router = express()

const User = require('../models/User');
const {registerValidation,loginValidation} = require('../validations/validation')

const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register new user
router.post('/register', async (req, res) => {
    // Validation 1 to check user input
    const {error} = registerValidation(req.body)
    if(error){
        return res.status(400).send({message:error['details'][0]['message']})
    }    
    
    // Validation 2 to check if user exists
    const userExists = await User.findOne({email:req.body.email})
    if(userExists){
        return res.status(400).send({message:'User already exists'})
    }

    //create hashed representation of password
    const salt = await bcryptjs.genSalt(5) //generate key
    const hashedPassword = await bcryptjs.hash(req.body.password, salt)

    // add data
    const user = new User({
        name:req.body.name,
        email:req.body.email,
        password:hashedPassword
    }) 
    try{ //save above data here
        const savedUser = await user.save()
        res.send(savedUser)
    }catch(err){
        res.status(400).send({message:err})
    }
    })

//login user
router.post('/login', async(req,res)=>{
    // Validation 1 to check user input
    const {error} = loginValidation(req.body)
    if(error){
        return res.status(400).send({message:error['details'][0]['message']})
    }

    // Validation 2 to check if user exists
    const user = await User.findOne({email:req.body.email})
    if(!user){
        return res.status(400).send({message:'User does not exist'})
    } 
    
    // Validation 3 to check user password
    const passwordValidation = await bcryptjs.compare(req.body.password,user.password)
    if(!passwordValidation){
        return res.status(400).send({message:'Password is wrong'})
    }

    // Generate an auth-token for only authorised and registered users to access DB
    const token = jwt.sign({_id:user._id}, process.env.JWT_SECRET) // create jsontoken using user id and JWT_SECRET
    res.header('auth-token',token).send({'auth-token':token})

})

module.exports = router