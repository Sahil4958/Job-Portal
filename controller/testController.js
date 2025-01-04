export const testPostController = (req,res)=>{
    const {name} = req.body;
    res.send(`Your name is ${name}`).status(201)
}
