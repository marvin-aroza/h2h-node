const mongoose = require('mongoose')


//master schema for categories
const categoryschema=mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim: true
    },
    isActive:{
        type:Boolean,
        default:true
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


const CategoryStruct = mongoose.model('Category',categoryschema)
// module.exports = Category


//master schema for subcategories
const subCategoryschema=mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim: true
    },
    category_id:{
        type:String,
        required:true,
        trim: true
    },
    isActive:{
        type:Boolean,
        default:true
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


const SubCategoryStruct = mongoose.model('SubCategory',subCategoryschema)


module.exports = { Category: CategoryStruct, SubCategory:SubCategoryStruct}