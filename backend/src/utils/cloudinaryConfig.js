import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"
import dotenv from "dotenv"
//dotenv.config()

// cloudinary.config({ 
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
//     api_key: process.env.CLOUDINARY_API_KEY, 
//     api_secret:  process.env.CLOUDINARY_API_SECRET
// });


export const uploadImage=async(filePath,folder,publicId=null)=>{
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret:  process.env.CLOUDINARY_API_SECRET
    });
    
    try {
        const options={
            resource_type:"image",
            overwrite:true
        }
        if(publicId){
            options.public_id=publicId
        }
        else{
            options.folder=folder;
            options.public_id=`${folder}_${Date.now()}`
        }

        const uploadedFile= await cloudinary.uploader.upload(filePath,options)
        console.log("File is uploaded on cloudinary",uploadedFile)
        console.log("file url from cloudinary",uploadedFile.secure_url)
        fs.unlinkSync(filePath)
        return {
            url:uploadedFile.secure_url,
            publicId:uploadedFile.public_id
        }
    } catch (error) {
        try {
            fs.unlinkSync(filePath);
          } catch (unlinkError) {
            console.log("Failed to delete local file:", unlinkError.message);
          }//remove the locally saved temp file as the upload has failed
          console.log(error)
        //   res.status(500).json({message:""})
    }
}