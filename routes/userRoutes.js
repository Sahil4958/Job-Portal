import express from 'express'
import userAuth from '../middlewares/authMiddleware.js';
import { userUpdateController } from '../controller/userController.js';


//router Object
const router = express.Router();

//routes 
//GET USERS || GET


//UPDATE USER || USER
router.put("/update-user",userAuth,userUpdateController)

export default router