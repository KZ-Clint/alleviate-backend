const mongoose = require('mongoose')

const stripetrxSchema = mongoose.Schema( {
    trx_code: {
        type : String,
        required : true
    },
    stripe_code: {
        type : String,
        required : true
    },
    amount: {
        type : Number,
        required : true
    },
    donor_id: {
        type : mongoose.Types.ObjectId, ref: "fundrgiver",
        required : true
    },
    cause_id: {
        type : mongoose.Types.ObjectId, ref: "fundrcause",
        required : true
    },
    status: {
        type : String,
        default : "pending"
    },
}, { timestamps: true } )


module.exports = mongoose.model('stripetrx', stripetrxSchema )