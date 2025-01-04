
import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs"
import JWT from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true, "Name is required"],
  },
  lastname: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    validate: validator.isEmail,
  },

  password: {
    type: String,
    required: [true, "Password is required"],
    minlength : [6, "Password length must be greater than 6 character"],
    select : true
  },

  location: {
    type: String,
    required : false,
    default: "Singapore",
  },


},

{timestamps :true }
);

//middleware

userSchema.pre('save', async function(){  //arrow function can't work here
  if(!this.isModified) return
const salt  = await bcrypt.genSalt(10);
this.password = await bcrypt.hash(this.password,salt)
})


//Json web token

userSchema.methods.createJWT = function(){
return JWT.sign({userId:this._id},process.env.JWT_SECRETKEY,{expiresIn:'1d'})
}


//Comparee Password

userSchema.methods.comparePassword = async function(userPassword) {
  const isMatch  = await bcrypt.compare(userPassword,this.password)
  return isMatch
}

export default mongoose.model("User",userSchema)
