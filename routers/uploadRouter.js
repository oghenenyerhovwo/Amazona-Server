import cloudinary from 'cloudinary';
import express from "express"


//  importing objects and functions
import {upload, cloud_keys} from '../connections/storageConnection.js'


const router = express.Router()


const {cloud_name,api_key ,api_secret} = cloud_keys()

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