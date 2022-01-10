import express from "express"
import multer from 'multer'
import path from "path"

//  importing objects and functions
import { isAuth,  } from "../utils.js";

const router = express.Router()
const __dirname= path.resolve()
const storage = multer.diskStorage({
    destination(req, file, cb){
        cb(null, __dirname + "/uploads")
    },
    filename(req, file, cb){
        cb(null, `${Date.now()}.jpg`)
    }
})

const upload= multer({storage})

router.post("/", 
    isAuth,
    upload.single("image"),
    (req, res) => {
        res.send(`/${req.file.path}`)
    }
);

const uploadRouter = router

export default uploadRouter