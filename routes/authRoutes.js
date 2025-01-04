import express from "express";
import {
  loginController,
  registerController,
} from "../controller/authController.js";

import rateLimit from "express-rate-limit";
import userAuth from "../middlewares/authMiddleware.js";

//ip Limiter

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  // store: ... , // Redis, Memcached, etc. See below.
});

//router Object
const router = express.Router();

//routes

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - firstname
 *         - lastname
 *         - email
 *         - password
 *         - location
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the user
 *           example: GHHH5669996432
 *         firstname:
 *           type: string
 *           description: User's first name
 *           example: Steven
 *         lastname:
 *           type: string
 *           description: User's last name
 *           example: Smith
 *         email:
 *           type: string
 *           description: User's email address
 *           example: abc@gmail.com
 *         password:
 *           type: string
 *           description: User's password (must be greater than 6 characters)
 *           example: 123455Sahil
 *         location:3
 * 
 *           type: string
 *           description: User's location (can be a city or country)
 *           example : Sydney
 *
 */

/**
 *  @swagger
 *  tags:
 *    name: Auth
 *    description: authentication apis
 */
/** 
* @swagger
* /api/v1/auth/register:
*    post:
*      summary: register new user
*      tags: [Auth]
*      requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/User'
*      responses:
*        200:
*          description: user created successfully
*          content:
*            application/json:
*              schema:
*                $ref: '#/components/schemas/User'
*        500:
*          description: internal serevr error
*/

//REGISTER ROUTES || POST
router.post("/register",  limiter, registerController);


/**
 * @swagger
 * /api/v1/auth/login:
 *  post:
 *    summary: login page
 *    tags: [Auth]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/User'
 *    responses:
 *      200:
 *        description: login successfull
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      500:
 *        description: something went wrong
 */


//LOGIN ROUTES || POST

router.post("/login",userAuth, limiter, loginController);

export default router;
