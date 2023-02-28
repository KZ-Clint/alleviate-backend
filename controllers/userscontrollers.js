const Giver = require('../models/giverModel')
const Advocate = require('../models/advocateModel')
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')

//CREATE ACCESS TOKEN
const createAccessToken = (_id) => {
  return jwt.sign({_id}, process.env.ACCESS_TOKEN_SECRET, { expiresIn : '12d' } )
}

const registerUser = async (req, res) => {
     const { firstName, lastName, email, password, termsAndConditions, countryCode, mobileNo, bio, role, passionate_cause, experience, profile_picture } = req.body
   
    try{ 
        //CHECK USER ROLE
        console.log(email)
        if( role === "giver" ) {
            const emailcheck = await Giver.findOne({email:email.toLowerCase()})
            if(emailcheck) return res.status(400).json({error : "Email is already in use!!"})   
        } 
        if( role === "advocate" ) {
            const emailcheck = await Advocate.findOne({email:email.toLowerCase()})
            if(emailcheck) return res.status(400).json({error : "Email is already in use!!"})   
        } 
        //GENERATE NEW HASHED PASSWORD
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash( password, salt )
        //SAVE USER
        let user;
        if( role === "giver" ) {
            user = await Giver.create({firstName, lastName, email:email.toLowerCase(), password:hashedPassword, termsAndConditions, countryCode, mobileNo, bio, role, passionate_cause})
        } 
        if( role === "advocate" ) {
            user = await Advocate.create({firstName, lastName, email:email.toLowerCase(), password:hashedPassword, termsAndConditions, countryCode, mobileNo, bio, role, experience, profile_picture})
        } 
    
        res.status(200).json({ user })
      } catch (err) {
          console.log({error: err.message})
          res.status(500).json({ error : err.message })
      }
 } 

 const loginUser = async (req, res) => {
     const { email, password } = req.body
   
    try{ 
        let user;
         const guser = await Giver.findOne({ email:email.toLowerCase() })
         const auser = await Advocate.findOne({ email:email.toLowerCase() })

         if(!guser && !auser ){
           return res.status(404).json({error : "User not found"})
         }
         if(guser) {
            user = guser
         }
         if(auser) {
            user = auser
         }
         const match = await bcrypt.compare(password, user.password)

         if(!match) {
          return res.status(400).json({error : "Invalid Password"}) 
         }
         //CREATE TOKEN
         const access_token = createAccessToken(user._id)
         res.status(200).json({msg : "Login Successful", user, access_token})
      } catch (err) {
          console.log({error: err.message})
          res.status(500).json({ error : err.message })
      }
 } 

 const getLoggedUser = async (req,res) => {
  
    try {      
      const {_id, role} = req.user
      console.log(req.user)
       
      let user;
      if(role === "giver" ) {
        user = await Giver.findById(_id).select('-password')
      }
      if(role === "advocate" ) {
        user = await Advocate.findById(_id).select('-password')
      }
    
      res.json({user})
      console.log(" Gotten User ")

    } catch (err) {
      console.log({error: err.message})
      res.status(400).json({error : err.message})
    }
}

const updateUser = async (req, res) => {
  //  const { username, email, password, termsAndConditions } = req.body
   const {_id, role} = req.user

  try{ 
       let user;
      if( role === "advocate" ){
       user = await Advocate.findByIdAndUpdate(_id, { $set: req.body }, {new:true} )
      } else {
        user = await Giver.findByIdAndUpdate(_id, { $set: req.body }, {new:true} )
      }        
      res.status(200).json({ msg: "Account has been updated",  user })
    } catch (err) {
        console.log({error: err.message})
        res.status(500).json({ error : err.message })
    }
} 

const getSpecificUser = async (req,res) => {
  
  try {      
    const {id} = req.params
    let user;
    const guser = await Giver.findById(id)
    const auser = await Advocate.findById(id)
    if(!guser && !auser ){
      return res.status(404).json({error : "User not found"})
    }
    if(guser) {
       user = guser
    }
    if(auser) {
       user = auser
    }
    res.json({user})
    console.log(" Gotten User ")

  } catch (err) {
    console.log({error: err.message})
    res.status(400).json({error : err.message})
  }
}



module.exports = { registerUser, loginUser, getLoggedUser, updateUser, getSpecificUser }