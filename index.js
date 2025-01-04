//import package
import express from "express";
import cors from "cors";
import morgan from "morgan";
import colors from "colors";
import "express-async-errors";

//API Documentation

import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

//Security Package

import helmet from "helmet";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";

//files import
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import authMiddleware from "./middlewares/authMiddleware.js";
//import routes
import testRoutes from "./routes/testRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";

//rest object
const app = express();

//dotenv config
dotenv.config();

//Swagger Api config

//Swagger Api Documentation
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Job Portal Application",
      description: "Node Js, Express Js Job Portal Application",
    },
    servers: [
      {
        url: "http://localhost:7007",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const spec = swaggerJSDoc(options);

//MongoDb Database Conection
connectDb();

const PORT = process.env.PORT;

//middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

// Security middlewares
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());

//routes
app.use("/api/v1/test", testRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/job", jobRoutes);

//homeroute root

app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(spec));


//error middleware
app.use(errorMiddleware);
app.use(authMiddleware);

//listen
app.listen(PORT, () => {
  console.log(
    `Your Server has been running in ${process.env.Dev_mode} mode at http://localhost:${PORT}`
      .bgYellow.magenta
  );
});
