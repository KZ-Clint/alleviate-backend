const mongoose = require('mongoose')

const advocateSchema = mongoose.Schema( {
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
    profile_picture: {
        type: String,
        default: ""
    },
    password: {
        type: String,
        required: true,
        min:6,
        max:20
    },
    countryCode: {
        type: Number,
        required: true
    },
    mobileNo: {
        type: Number,
        required: true
    },
    cause_started: {
        type: Array,
        default:[]
    },
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
        required: true
    },
    max:{
        type: Number,
        default: 2
    },
    root: {
        type: Boolean,
        default: false
    },
    bio: {
        type: String,
        max:100
    },
    experience: {
        type: String,
        max:70
    }
}, { timestamps: true } )


module.exports = mongoose.model('fundradvc', advocateSchema )