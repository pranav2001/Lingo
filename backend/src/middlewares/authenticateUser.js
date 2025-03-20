import jwt from "jsonwebtoken";
//Use bearer prefix
const authenticateUser=async(req,res,next)=>{
    try {
        let token=req.headers['authorization'];
        if(!token){
            return res.status(401).json({message:"Unauthorized - No token provided"})
        }
        const decodedToken=jwt.verify(token,process.env.JWT_SECRET);
        if(!decodedToken){
            return res.status(401).json({message:"Unauthorized - Invalid Token or Token expired"})
        }
        req.currentUser={userId:decodedToken.userId}
        next()
    } catch (error) {
        console.log("Error in authenticate user middleware",error.message);
        res.status(500).json({message:"Internal server error"});
    }
}

export default authenticateUser;