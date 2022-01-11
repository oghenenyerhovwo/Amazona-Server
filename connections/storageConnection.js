import {v2 as cloudinary} from 'cloudinary';
import { CloudinaryStorage } from'multer-storage-cloudinary';
import multer from "multer"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'Amazona',
        allowedFormats: ['jpeg', 'png', 'jpg'],
        public_id: (req, file) => file.filename,
    }
});

 const parser = multer({storage, storage })

export default parser