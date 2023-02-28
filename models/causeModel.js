const mongoose = require('mongoose')

const causeSchema = mongoose.Schema( {
    founderName: {
        type : String,
        required : true
    },
    founderObject_id: {
        type : mongoose.Types.ObjectId, ref: "fundradvocate",
        required : true
    },
    founderString_id: {
        type: String,
        required: true,
    },
    cause_title: {
        type: String,
        required: true,
        unique: true
    },
    target_amount: {
        type: Number,
        required: true
    },
    deadline: {
        type: Date,
        required: true
    },
    rating: {
        type: Array,
        default:[]
    },
    category: {
        type: String,
        required: true
    },
    amount_received: {
        type: Number,
        default: 0
    },
    donations_received: [ {
            donor_id: { type: mongoose.Types.ObjectId, ref: "fundrgiver" },
            donor_name: { type:String },
            amount: { type: Number }, 
            status: { type: String },        
            dateCreated:  { type : Date, default: Date.now }
        } ],
    followers: {
        type: Array,
        default:[]
    },
    cover_photo: {
        type: Array,
        default: []
    },
    authenticity: {
        type: String,
        default: "average"
    },
    story: {
        type: String,
        required: true
    },
    acc_number: {
        type: Number,
        required: true
    },
    bank: {
        type: String,
        required: true
    },
    solution: {
        type: String,
        required: true
    },
    isSuspended: {
        type: Boolean,
        default: false
    },
    isFinished: {
        type: Boolean,
        default: false
    },
    links: {
        type: Array,
        default:[]
    },
    isSpecial: {
        type: Boolean,
        default: false
    },
    isPayout: {
        type: Boolean,
        default: false
    }
}, { timestamps: true } )


module.exports = mongoose.model('fundrcause', causeSchema )