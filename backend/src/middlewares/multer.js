import multer from "multer";
import { fileURLToPath } from 'url';
import path from "path";
const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename)

const tempDir = path.join(__dirname, '../public/temp');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, tempDir)
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })
  
  export const upload = multer({ storage }) 