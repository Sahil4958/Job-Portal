import JWT from 'jsonwebtoken';

const userAuth = async(req,res,next) =>{
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer')){
        next('Auth Failed')
    }
    const token = authHeader.split(' ')[1];

    try{
      const payload = JWT.verify(token , process.env.JWT_SECRETKEY )
      req.user = {userId : payload.userId};
      next()
    }catch(err){
        next('Auth Failed') 
    }
}

export default userAuth