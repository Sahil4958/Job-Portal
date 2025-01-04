import userModel from "../models/userModel.js";

export const userUpdateController = async(req,res,next) =>{
    const {firstname,lastname,email,location} = req.body;

    if(!firstname || !lastname  || !email || !location ){
        next("Please provide all missing fields")
    }

    const user = await userModel.findOne({_id: req.user.userId})
    user.firstname = firstname;
    user.lastname = lastname;
    user.email = email;
    user.location = location

    await user.save()

    const token = await user.createJWT()
    res.status(200).json({
        message : "User updated succesfully",
        user,
        token
    })

}