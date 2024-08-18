
import { Schema,get,model } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { stat } from "fs";
const userSchema = new Schema({
    fullName:{
        type:String,
        required:[true,"Please provide your full name"],
        minLength:[3,"Full name must be at least 3 characters long"],
        maxLength:[50,"Full name must be at most 50 characters long"],
        lowercase:true,
        trim: true,
    },
    email:{
        type:String,
        required:[true,"Please provide your email address"],
        unique:true,
        lowercase:true,
        trim:true,
        match:[/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,"Please provide a valid email address"],
    },
    password:{
        type:String,
        required:[true,"Please provide a password"],
        minLength:[8,"Password must be at least 8 characters long"],
        // maxLength:[50,"Password must be at most 50 characters long"],
        select:false,
    },
    avatar:{
        public_id:{
            type:String,
            default:null,
        },
        secure_url:{
            type:String,
            default:null,
        },
    },
    role:{
        type:String,
        enum:["USER","ADMIN"],
        default:"USER",
    }, 
    forgetPasswordToken: String,
    forgetPasswordExpire: Date,
    subscription:{
        id:{type:String},
        status:{type:String}
    },
},
{
    timestamps:true,
});

userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        return next();
    }
    this.password = await bcrypt.hashSync(this.password,10);
});

userSchema.methods = {
    generateJWTToken: async function(){
        return await jwt.sign({id:this._id,email: this.email,subscription: this.subscription,avatar: this.avatar,role: this.role},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRE});
    },
    comparePassword: async function(enteredPassword){
        return await bcrypt.compare(enteredPassword,this.password);
    },
    generatePasswordResetToken: async function(){
        const resetToken = crypto.randomBytes(20).toString('hex');

        this.forgetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

        this.forgetPasswordExpire = Date.now() + 30 * 60 * 1000; //30min from now

        return resetToken;
    }
}

const User = model('User',userSchema);

export default User;
