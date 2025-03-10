import mongoose from "mongoose";

const adminSchema = mongoose.Schema({
    name:{
        type: String,
        require:true
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true

    },
    verified:{type:Boolean,default:false},
    verificationToken:{type:String}
},{ timestamps: true });

const adminAuth = mongoose.model("adminAuth",adminSchema)

export default adminAuth;