import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDb = async () => {
  await mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log(
        `Your MongoDB Database ${mongoose.connection.host} has been connected sucessfully`
          .bgMagenta.white
      );
    })
    .catch((err) => {
      console.log(`MongoDB Error ${err}`);
    });
};

export default connectDb;
