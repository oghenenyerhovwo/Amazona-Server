import multer from 'multer'
import dotenv from "dotenv"
dotenv.config()

const storage = multer.diskStorage({})

export const upload= multer({storage})

export function  cloud_keys (){
    return {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_KEY,
        api_secret: process.env.CLOUDINARY_SECRET
    }
}