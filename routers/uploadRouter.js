import cloudinary from 'cloudinary';
import express from "express"
import dotenv from "dotenv"

//  importing objects and functions
import {upload, cloud_keys} from '../connections/storageConnection.js'

dotenv.config()
const router = express.Router()
console.log(process.env.MONGODB_URL)

const {cloud_name,api_key ,api_secret} = cloud_keys()
console.log( {cloud_name,api_key ,api_secret})
cloudinary.config({
    cloud_name,
    api_key,
    api_secret
});

// create product route
router.post("/", 
    upload.single('image'),
    async (req, res) => {
        try {
            if (!req.file){
                return res.status(400).send({message: "Select image"})
            }
            try {
                await cloudinary.v2.uploader.upload(
                    req.file.path, {
                        folder: "Amazona",
                        resource_type: "image",
                    },)
                .then(data => {res.send(data.secure_url)})
                
            } catch (error) {
                console.log(error)
            }
        } catch (error) {
            console.log(error)
        }    
    }
);

const uploadRouter= router

export default uploadRouter