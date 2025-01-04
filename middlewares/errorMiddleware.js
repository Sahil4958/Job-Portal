//error Middleware || NEXT function

const errorMiddleware = (err, req, res, next) => {
  console.log(err);
  const defaultErrors = {
    statusCode: 500,
    message: err,
  };


  //missing field errors
  if (err.name === "ValidationError") {
    defaultErrors.statusCode = 400,
      defaultErrors.message = Object.values(err.errors)
     .map((item) => item.message)
        .join(",");
  }


 //error duplicate

 if(err.code && err.code === 11000){
    defaultErrors.statusCode = 400;
    defaultErrors.message = `${Object.keys(err.keyValue)} fields has to be unique`
 }
 res.status(defaultErrors.statusCode).json({ message: defaultErrors.message });
};

export default errorMiddleware;
