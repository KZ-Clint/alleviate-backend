const axios = require('axios')
const Giver = require('../models/giverModel')
const Coinbase = require('../models/coinbasetrxModel')
const Cause = require('../models/causeModel')

const createCharge = async (req, res) => {
    const { firstName, lastName, user_id, amount, cause_title, cause_id } = req.body
    const data = { name:`${firstName} ${lastName}`, description:`${cause_title}`, pricing_type:"no_price" }
    try{ 
        const response = await axios.post(`https://api.commerce.coinbase.com/charges`, data, { headers: {
            "X-CC-Api-Key": `d84258a0-6549-4d33-a48c-75e552f3d164`,
             "X-CC-Version": `2018-03-22` 
          }} )  
          const coinbasetrx = await Coinbase.create({ code:response.data.data.code, amount, donor_id:user_id, cause_id })
          console.log(coinbasetrx)
         res.status(200).json(response.data) 
      } catch (err) {
          console.log({error: err.message})
          res.status(500).json({ error : err.message })
      }
 } 

 const confirmCharge = async (req, res) => {
     
    try{ 
        const coinbasetrx = await Coinbase.findOne({code:req.params.code})
        if( !coinbasetrx || coinbasetrx.status === "success" ) {
            return res.status(400).json({error : "The code is either invalid or successfull!!"})  
        }
        const cause1 = await Cause.findById(coinbasetrx.cause_id).select('cause_title amount_received')
        const giver1 = await Giver.findById(coinbasetrx.donor_id).select('firstName lastName')
     
        const response = await axios.get(`https://api.commerce.coinbase.com/charges/${req.params.code}`,  { headers: {
            "X-CC-Api-Key": `d84258a0-6549-4d33-a48c-75e552f3d164`,
             "X-CC-Version": `2018-03-22` 
          }} )  
          
          console.log( "some", response.data.data.timeline.some( (t) => t.status === "COMPLETED" ) )
          if( response.data.data.timeline.some( (t) => t.status === "COMPLETED" )  ) {
            await Coinbase.updateOne( {code:req.params.code}, { status:"success" })
            await Giver.updateOne({ _id: coinbasetrx.donor_id}, {  
                $push: { donations_made: { object_id:coinbasetrx.donor_id, string_id:coinbasetrx.donor_id, amount:coinbasetrx.amount, cause:cause1.cause_title } }
             })
            await Cause.updateOne( { _id:coinbasetrx.cause_id }, { 
                amount_received: parseInt(cause1.amount_received) + parseInt(coinbasetrx.amount),
                 $push : { donations_received: {  donor_id:coinbasetrx.donor_id, donor_name: `${giver1.firstName} ${giver1.lastName}`, amount:coinbasetrx.amount, status:"success" } }
            })
          }
        
         res.status(200).json(response.data) 
      } catch (err) {
          console.log({error: err.message})
          res.status(500).json({ error : err.message })
      }
 } 



module.exports = { createCharge, confirmCharge }