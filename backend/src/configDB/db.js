import mongoose from "mongoose";

const connectDB= async()=>{
    try {
        const dbConnect=await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected to MongoDB successfully")
    } catch (error) {
        console.log("MongoDB connnection error:",error);
    }
}
export default connectDB