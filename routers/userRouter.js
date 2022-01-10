import express from "express"
import expressAsyncHandler from "express-async-handler"
import bcrypt from 'bcryptjs';

//  importing objects and functions
import data from "../data.js"
import User from "../models/userModel.js";
import { generateToken, isAuth, isAdmin } from "../utils.js";

const router = express.Router()

router.get("/seed", 
    expressAsyncHandler(
        async (req, res) => {
            // await User.deleteMany({})
            const createdUser = await User.insertMany(data.users)
            res.send({createdUser})
        }
    )
);

router.get("/", 
    isAuth,
    isAdmin,
    expressAsyncHandler(
        async (req, res) => {
            User
                .find()
                .then(users => res.send(users))
        }
    )
);

router.put("/:id", 
    isAuth,
    isAdmin,
    expressAsyncHandler(
        async (req, res) => {
            const editedUser={}
            const userId = req.params.id
            const user = await User.findById(userId)
            if(user){
                editedUser.name = req.body.name || user.name
                editedUser.email = req.body.email || user.email
                User
                    .findByIdAndUpdate(userId, req.body, {new:true})
                    .then(updateUser => res.send(updateUser))
            }
        }
    )
);

router.delete("/:id", 
    isAuth,
    isAdmin,
    expressAsyncHandler(
        async (req, res) => {
            const userId = req.params.id
            const foundUser = await User.findById(userId)
            if(foundUser){
                if(foundUser.email =="admin@example.com" || foundUser._id == req.user._id ){
                    return res.status(404).send({message: "Cannot delete admin or a logged in account"})
                } 
                User
                    .findByIdAndRemove(userId)
                    .then(() => res.send(userId))
            }
            
        }
    )
);

router.post("/signIn", 
    expressAsyncHandler(
        async (req, res) => {
            const foundUser = await User.findOne({email: req.body.email})
            if(foundUser){
                if(bcrypt.compareSync(req.body.password, foundUser.password)){
                    res.send({
                        _id: foundUser._id,
                        name: foundUser.name,
                        email: foundUser.email,
                        isAdmin: foundUser.isAdmin,
                        isSeller: foundUser.isSeller,
                        token: generateToken(foundUser)
                    })
                    return;
                } else {
                    res.status(401).send({message: "Password is incorrect"})
                    return;
                }
            }
            res.status(401).send({message: "Email does not exist"})
        }
    )
);

router.post("/register", 
    expressAsyncHandler(
        async (req, res) => {
            const newUser= {
                ...req.body,
                password: bcrypt.hashSync(req.body.password, 8)
            }
            const createdUser= await User.create(newUser)
            res.send({
                _id: createdUser._id,
                name: createdUser.name,
                email: createdUser.email,
                isAdmin: createdUser.isAdmin,
                isSeller: createdUser.isSeller,
                token: generateToken(createdUser)
            })
        }
    )
);

router.get("/:id", 
    expressAsyncHandler(
        async (req, res) => {
            const foundUser = await User.findById(req.params.id)
            if(foundUser){
                return res.send({
                    _id: foundUser._id,
                    name: foundUser.name,
                    email: foundUser.email,
                    isAdmin: foundUser.isAdmin,
                    isSeller: foundUser.isSeller,
                    token: generateToken(foundUser)
                })
            }
            res.status(404).send({message: "User not found"})
        }
    )
);

router.put("/profile", 
    isAuth,
    expressAsyncHandler(
        async (req, res) => {
            const editedUser={}
            const user = await User.findById(req.user._id)
            if(user){
                editedUser.name = req.body.name || user.name
                editedUser.email = req.body.email || user.email
                if(req.body.password){
                    editedUser.password=bcrypt.hashSync(req.body.password, 8)
                }
                if(user.isSeller){
                    const seller={
                        name: req.body.sellerName || user.seller.name,
                        logo: req.body.sellerLogo || user.seller.logo,
                        description: req.body.sellerDescription || user.seller.description,
                    }
                    editedUser.seller= seller
                }
                User
                    .findByIdAndUpdate(req.user._id, editedUser, {new:true})
                    .then(data => res.send({
                        updatedData: {
                            _id: data._id,
                            name: data.name,
                            email: data.email,
                            isAdmin: data.isAdmin,
                            isSeller: data.isSeller,
                            token: generateToken(data)
                        },
                        message: "Profile has been updated successfully"
                }))
            }
        }
    )
);

const userRouter= router

export default userRouter
