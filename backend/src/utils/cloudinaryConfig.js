import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

export const uploadImage = async (filePath, folder, publicId) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  try {
    const options = {
      resource_type: "image",
      overwrite: true,
    };
    if (publicId) {
      console.log(publicId);
      options.public_id = publicId;
    } else {
      options.folder = folder;
      options.public_id = `${Date.now()}`;
    }
    console.log("options object", options);
    const uploadedFile = await cloudinary.uploader.upload(filePath, options);
    fs.unlinkSync(filePath);
    return {
      url: uploadedFile.secure_url,
      publicId: uploadedFile.public_id,
    };
  } catch (error) {
    try {
      fs.unlinkSync(filePath);
    } catch (unlinkError) {
      console.log("Failed to delete local file:", unlinkError.message);
    }
    console.log(error);
  }
};
