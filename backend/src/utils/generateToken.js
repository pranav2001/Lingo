import jwt from "jsonwebtoken"
export default function generateToken(userId){
    const token = jwt.sign({userId},process.env.JWT_SECRET,{expiresIn:"7d"})
    return token
}