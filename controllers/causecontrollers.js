const Giver = require('../models/giverModel')
const Advocate = require('../models/advocateModel')
const Cause = require('../models/causeModel')

class APIfeatures {
    constructor(query, queryString) { 
    this.query = query;
    this.queryString = queryString;
    }
    filtering() {
       const queryObj = {...this.queryString}
 
       const excludeFields = ['page', 'sort', 'limit']
       excludeFields.forEach( (el) => {
          delete(queryObj[el]) } )

          if( queryObj.title !== 'all' ) {
             this.query.find({ cause_title: { $regex: queryObj.title } })
          }
        this.query.find()
        return this;
    }
    sorting() {
       if(this.queryString.sort) {
          const sortBy = this.queryString.sort.split(',').join('')
          this.query = this.query.sort(sortBy)
       }else{
          this.query = this.query.sort('-createdAt')
       }
       return this;
    }
    paginating(){
       const page = this.queryString.page * 1 || 1
       const limit = this.queryString.limit * 1 || 8
       const skip = (page - 1) * limit;
       this.query = this.query.skip(skip).limit(limit)
       return this;
    }
 }




const createCause = async (req, res) => {
    const { _id, firstName, lastName, role, cause_started, max } = req.user
     const { cause_title, target_amount, deadline, category, cover_photo, story, solution, social_link, web_link, bank, acc_number } = req.body
     let aduser;
    try{   
        if( role === "giver" ) {
            return res.status(400).json({error : "You are not authenticated to use this service!!"})   
        } 
        if( cause_started.length >=  max  ) {
            return res.status(400).json({error : "You have reached your maximun numer of causes to start!!"})   
        } 
        const causeCheck = await Cause.findOne({cause_title:cause_title})
        if(causeCheck) { return res.status(400).json({error : "The cause title is already taken!!"})    }

        const cause = await Cause.create({ founderName: `${firstName} ${lastName}`, founderObject_id:_id, founderString_id:_id, cause_title:cause_title.trim(),target_amount, deadline: new Date(deadline).toISOString() ,
        category, cover_photo, story, solution, links:[ social_link, web_link], bank, acc_number }) 

        if( role === "advocate" ) {
            aduser = await Advocate.findByIdAndUpdate(_id,  { $push: { cause_started: cause._id } }, {new:true} )   
        } 
        

        res.status(200).json({ cause, aduser })
      } catch (err) {
          console.log({error: err.message})
          res.status(500).json({ error : err.message })
      }
 } 

 const getSpecialCause = async (req, res) => {
   
    try{   
        const cause = await Cause.find({isSpecial:true}) 

        res.status(200).json({ cause })
      } catch (err) {
          console.log({error: err.message})
          res.status(500).json({ error : err.message })
      }
 } 

 const getSpecificCause = async(req, res) => {
    const {id} = req.params
        try{   
        const cause = await Cause.findOne({ cause_title:id }) 
        res.status(200).json({ cause })
      } catch (err) {
          console.log({error: err.message})
          res.status(500).json({ error : err.message })
      }
 }

 const getCategoryCause = async(req, res) => {
    const {category} = req.params
        try{   
            const features = new APIfeatures(Cause.find({ category }), req.query)
            .filtering().sorting().paginating()     
            console.log(req.query)
            const cause = await features.query
        // const cause = await Cause.find({ category }) 
        res.status(200).json({ cause })
      } catch (err) {
          console.log({error: err.message})
          res.status(500).json({ error : err.message })
      }
 }
 const getAdvocateCreatedCause = async(req, res) => {
    const {_id, role} = req.user
    if( role === "giver" ) {
        return res.status(400).json({error : "You are not authenticated to use this service!!"})   
    } 
        try{   
        const cause = await Cause.find({ founderObject_id:_id }) 
     
        res.status(200).json({ cause })
      } catch (err) {
          console.log({error: err.message})
          res.status(500).json({ error : err.message })
      }
 }

 const updateFollowingAndFollower = async(req, res) => {
    const {_id, role} = req.user
    const {id, userId} = req.params
    const {cause} = req.body
        try{ 
         
            const cause2 = await Cause.findOne({cause_title: id})
            if (!cause2 ){
                 return res.status(400).json({error : "No cause like this!!"})   
              }
           if (cause2.followers.includes(userId) ){
             console.log("where")
              return res.status(400).json({error : "You already follow this charity!!"})   
           }
            const giveruser = await Giver.findOneAndUpdate({_id: userId},  { $push: { cause_following: { object_id: cause2._id, string_id:cause2._id, cover_picture:cause2.cover_photo[0].url, cause:cause2.cause_title, target_amount:cause2.target_amount } } }, {new:true} )   
               
            const newcauses = await Cause.findOneAndUpdate( {cause_title:id}, { $push: { followers: userId} }, {new:true}) 

        res.status(200).json({ giveruser, newcauses })
      } catch (err) {
          console.log({error: err.message})
          res.status(500).json({ error : err.message })
      }
 }

 const pullFollowingAndFollower = async(req, res) => {
    const {_id, role} = req.user
    const {id, userId} = req.params
    
        try{ 
          
            const cause2 = await Cause.findOne( {cause_title:id})
            if (!cause2 ){
                return res.status(400).json({error : "No cause like this!!"})   
             }
           if (!cause2.followers.includes(userId) ){
              return res.status(400).json({error : "You do not follow this charity!!"})   
           }
            const giveruser = await Giver.findOneAndUpdate({_id: userId},  { $pull: { cause_following: { cause: cause2.cause_title } } }, {new:true} )   
               
            const newcauses = await Cause.findOneAndUpdate( {cause_title:id}, { $pull: { followers: userId} }, {new:true}) 

        res.status(200).json({ giveruser, newcauses })
      } catch (err) {
          console.log({error: err.message})
          res.status(500).json({ error : err.message })
      }
 }

 const getCauseFollowing = async (req, res) => {

    const {userId} = req.params
   
  try{ 
     const cause = await Cause.find({ followers:{ $in:[userId] } })
     res.status(200).json({ cause })
    } catch (err) {
        console.log({error: err.message})
        res.status(500).json({ error : err.message })
    }
} 


const donateToCause = async (req, res) => {
    const { _id, role, firstName, lastName} = req.user
    const { id, userId} = req.params
    const { amount, cause } = req.body
  try{ 
    
    if( role === "advocate" ) {
        return res.status(400).json({error : "You are not allowed to donate!!"})   
    } 
    const cause1 = await Cause.findById(id)
     const user = await Giver.findByIdAndUpdate(userId, {  
        $push: { donations_made: { object_id:userId, string_id:userId, amount, cause } }
     },{new:true} )
     const newcause = await Cause.findByIdAndUpdate( id, { 
        amount_received: parseInt(cause1.amount_received) + parseInt(amount),
         $push : { donations_received: {  donor_id: userId, donor_name: `${firstName} ${lastName}`, amount, status:"pending" } }
      }, {new:true} )

     res.status(200).json({ newcause , user})
    } catch (err) {
        console.log({error: err.message})
        res.status(500).json({ error : err.message })
    }
} 

const updateCharityRating = async(req, res) => {
   
    const {id, userId} = req.params
    const {rating} = req.body
        try{       
            const cause2 = await Cause.findById(id)
            
           if (cause2.rating.some( (r) => r.userId === userId ) ){          
              return res.status(400).json({error : "You already rate this charity!!"})   
           }         
            const newcauses = await Cause.findOneAndUpdate( {_id:id}, { $push:{ rating: { userId, rating} }}, {new:true}) 

        res.status(200).json({  newcauses })
      } catch (err) {
          console.log({error: err.message})
          res.status(500).json({ error : err.message })
      }
 }

 const getAdvocateCreatedCause2 = async(req, res) => {
    const {id} = req.params
        try{   
        const cause = await Cause.find({ founderObject_id:id })    
        res.status(200).json({ cause })
      } catch (err) {
          console.log({error: err.message})
          res.status(500).json({ error : err.message })
      }
 }



module.exports = { createCause, getSpecialCause, getSpecificCause, getCategoryCause, getAdvocateCreatedCause, updateFollowingAndFollower, pullFollowingAndFollower, getCauseFollowing,
                  donateToCause, updateCharityRating, getAdvocateCreatedCause2 }