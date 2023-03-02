const mongoose = require('mongoose')

const coinbasetrxSchema = mongoose.Schema( {
    code: {
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


module.exports = mongoose.model('fundrcoinbasetrx', coinbasetrxSchema )