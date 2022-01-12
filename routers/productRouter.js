import express from "express"
import expressAsyncHandler from "express-async-handler"



//  importing objects and functions
import data from "../data.js"
import Product from "../models/productModel.js";
import { isAuth, isAdmin, isAdminOrSeller } from "../utils.js";



const router = express.Router()


router.get("/seed", 
    expressAsyncHandler(
        async (req, res) => {
            await Product.deleteMany({})
            const createdProduct = await Product.insertMany(data.products)
            res.send({createdProduct})
        }
    )
);

router.get("/", 
    expressAsyncHandler(
        async (req, res) => {
            const seller = req.query.seller || ""
            const sellerFilter = seller ? {seller} : {}
            const products = await Product.find({...sellerFilter})
            res.json(products)
        }
    )
);

router.get("/:id", 
    expressAsyncHandler(
        async (req, res) => {
            const product = await Product.findById(req.params.id)
            if(product){res.json(product)}
            else{res.status(404).send({message: "Product not found"})}
        }
    )
);

// create product route
router.post("/", 
    isAuth,
    isAdminOrSeller,
    expressAsyncHandler(async (req, res) => {
        const newProduct= {
            ...req.body,
           seller: req.user._id,
       }
       Product
           .create(newProduct)
           .then(createdProduct => res.send(createdProduct))
    })
);

// update product route
router.put("/:id", 
    isAuth,
    isAdminOrSeller,
    expressAsyncHandler(
        async (req, res) => {
            const productId= req.params.id
            const foundProduct= Product.findById(productId)
            if (foundProduct){
                Product
                    .findByIdAndUpdate(productId, req.body, {new:true})
                    .then(updateProduct => res.send(updateProduct))
            } else {
                res.status(404).send({message: "Product not found"})
            }
        }
    )
);

// delete product route
router.delete("/:id", 
    isAuth,
    isAdmin,
    expressAsyncHandler(
        async (req, res) => {
            const productId= req.params.id
            const foundProduct= Product.findById(productId)
            if (foundProduct){
                Product
                    .findByIdAndRemove(productId)
                    .then(() => res.send(productId))
            } else {
                res.status(404).send({message: "Product not found"})
            }
        }
    )
);

const productRouter= router

export default productRouter