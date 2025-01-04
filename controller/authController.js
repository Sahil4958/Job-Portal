import userModel from "../models/userModel.js";

export const registerController = async (req, res,next) => {

    const { firstname, lastname ,email, password } = req.body;

    //validate

    if (!firstname) {
     next( "Firstname is required")
    }

    if (!email) {
next("Email is required")
    }

    if (!password) {
   next("Password is required and must be greather than 6 character")
    }

    const existingUser = await userModel.findOne({email });
    if (existingUser) {
   next("Email is alredy exist please login it ")
    }

    const user = await userModel.create({ firstname, lastname, email, password });
    //token
    const token = user.createJWT();
    res.status(201).send({
      sucess: true,
      message: "User registerd Sucessfully ",
      user :{
        firstname : user.firstname,
        lastname : user.lastname,
        email: user.email,
        location : user.location
      },
      token
    });
};


export const loginController = async (req,res,next)=>{
   const {email,password} = req.body

   //validate
   if(!email ||  !password){
    next("Please Provide email and password")
   }

  //find user by email
   const user = await userModel.findOne({email}).select("+password")
   if(!user){
    next("Username or Password is invalid")
   }

   //Compare password

   const isMatch = await user.comparePassword(password)
   if(!isMatch){
    next("Username or Password is invalid")
   }
    user.password = undefined
   const token = user.createJWT();
   res.status(200).json({
    sucess : true,
    message : "User logged sucessfully",
    user,
    token
   })

}