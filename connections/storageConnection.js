import multer from 'multer'
import dotenv from "dotenv"
dotenv.config()

const storage = multer.diskStorage({})

export const upload= multer({storage})