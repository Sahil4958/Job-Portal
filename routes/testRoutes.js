import express from 'express';
import { testPostController } from '../controller/testController.js';
import userAuth from '../middlewares/authMiddleware.js';

//router Object
const router = express.Router();

//routes

router.post('/test-api',userAuth,testPostController);

export default router;