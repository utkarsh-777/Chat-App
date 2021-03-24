const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const roomSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    messages:[
        {
            user:{
                type:String
            },
            msg:{
                type:String
            }
        }
    ],
    createdBy:{
        type:ObjectId,
        ref:"User"
    }
},{timestamps:true})

module.exports = mongoose.model("Room",roomSchema);