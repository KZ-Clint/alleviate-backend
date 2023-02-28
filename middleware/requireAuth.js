const jwt = require('jsonwebtoken')
const Giver = require('../models/giverModel')
const Advocate = require('../models/advocateModel')

const requireAuth = async ( req, res, next ) => {

    //VERIFY AUTHENTICATION
    const { authorization } = req.headers

    if(!authorization) {
        return res.status(401).json( { error: "Authorization token required" } )
    }

    const token = authorization.split( ' ' )[1]

    try{
       const {_id} = jwt.verify( token, process.env.ACCESS_TOKEN_SECRET )

       req.user = await Giver.findOne({_id})
       if(req.user) {
        return next()
       }
       req.user = await Advocate.findOne({_id})  
       console.log(req.user)   
       next()


    }catch (error) {
        console.log(error)
        res.status(401).json({error: 'Request is not authorized' })
    }

}

module.exports = requireAuth