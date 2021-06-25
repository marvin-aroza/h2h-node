const mongoose = require('mongoose')


//newsletter
const newsletterSchema=mongoose.Schema({
    body:{
        type:String,
        trim: true,
        required: true
    },
    status:{
        type:String,
        default:'Pending'
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    updatedAt:{
        type:Date,
        default:Date.now()
    }
})


const newsletterSchemaStruct = mongoose.model('Newsletter',newsletterSchema)


//subscriptions
const newsletterSubscriptionSchema=mongoose.Schema({
    userId:{
        type:mongoose.Schema.ObjectId
    },
    email: {
        type:String,
        trim:true
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    updatedAt:{
        type:Date,
        default:Date.now()
    }
})


const newsletterSubscriptionStruct = mongoose.model('newsletterSubscription',newsletterSubscriptionSchema)

module.exports = { Newsletter: newsletterSchemaStruct, NewsletterSubscription:newsletterSubscriptionStruct}