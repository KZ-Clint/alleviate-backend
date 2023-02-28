const mongoose = require('mongoose')

const giverSchema = mongoose.Schema( {
    firstName: {
        type : String,
        required : true,
        min:3,
        max:20,
    },
    lastName: {
        type : String,
        required : true,
        min:3,
        max:20,
    },
    email: {
        type: String,
        required: true,
        max:50,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min:6,
        max:20
    },
    countryCode: {
        type: String,
        required: true
    },
    mobileNo: {
        type: Number,
        required: true
    },
    donations_made: [ {
            object_id: { type: mongoose.Types.ObjectId, ref: "fundrgiver" },
            string_id: { type:String },
            amount: { type: Number },
            cause: { type: String },           
            dateCreated:  { type : Date, default: Date.now }
        } ],
    cause_following: [ {
            object_id: { type: mongoose.Types.ObjectId, ref: "fundrcause" },
            string_id: { type:String },
            cover_picture: { type:String },
            cause: { type: String }, 
            target_amount: { type: Number },
            dateCreated:  { type : Date, default: Date.now }
        } ],
    termsAndConditions: {
        type: Boolean,
        required: true
    },
    authenticity: {
        type: String,
        default: "average"
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isSuspended: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        required:true
    },
    root: {
        type: Boolean,
        default: false
    },
    bio: {
        type: String,
        max:100
    },
    passionate_cause: {
        type: String,
        max:50
    }
}, { timestamps: true } )


module.exports = mongoose.model('fundrgiver', giverSchema )