import multer from "multer";
import { fileURLToPath } from 'url';
import path from "path";
const __filename = fileURLToPath(import.meta.url); // Get the file path
const __dirname = path.dirname(__filename)
//import.meta.url gives the file URL of the current module.
//fileURLToPath(import.meta.url) converts that file URL into an absolute file path.
//This is equivalent to __filename in CommonJS, but in ES modules, we don't have __filename by default, so we need to derive it this way.
//This extracts the directory name from __filename, similar to __dirname in CommonJS.
//In ES modules, __dirname is not defined by default, so we generate it manually.
const tempDir = path.join(__dirname, '../public/temp');

//Need to see if I have to create separate functions for thumbnails as well as videos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, tempDir)
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })
  
  export const upload = multer({ storage }) //Maybe I could provide different uploads for different sort of files(a different one for thumbnail,video upload)