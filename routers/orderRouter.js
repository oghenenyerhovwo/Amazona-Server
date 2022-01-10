import express from "express"
import expressAsyncHandler from "express-async-handler"

//  importing objects and functions
import Order from "../models/orderModel.js";
import { isAuth, isAdmin, isAdminOrSeller } from "../utils.js";

const router = express.Router()

router.get("/mine",
    isAuth,
    expressAsyncHandler(
        async (req, res) => {
            Order
                .find({user: req.user._id})
                .then(orders => res.send(orders))
        }
    )
);

router.get("/",
    isAuth,
    isAdminOrSeller,
    expressAsyncHandler(
        async (req, res) => {
            const seller = req.query.seller || ""
            const sellerFilter = seller ? {seller} : {}
            Order
                .find({...sellerFilter}).populate("user", "name")
                .then(orders => res.send(orders))
        }
    )
);

router.post("/", 
    isAuth,
    expressAsyncHandler(
        async (req, res) => {
            const newOrder= {
                ...req.body,
                user: req.user._id,
            }
            if(req.body.orderItems.length === 0){
                res.status(400).send({message: "Cart is empty"})
            } else {
                Order
                    .create(newOrder)
                    .then(createdOrder => res.send({
                        message: "New Order created",
                        order: {seller: req.body.orderItems[0], ...createdOrder}
                    }))
            }
        }
    )
);

router.get("/:id", 
    isAuth,
    expressAsyncHandler(
        async (req, res) => {
            Order
                .findById(req.params.id)
                .then(foundOrder => res.send(foundOrder))
                .catch(() => res.status(404).send({message: "Order Not found"}))
        }
    )
);

router.delete("/:id", 
    isAuth,
    isAdmin,
    expressAsyncHandler(
        async (req, res) => {
            const orderId= req.params.id
            const foundOrder = await Order.findById(orderId)
            if(foundOrder){
                Order
                    .findByIdAndRemove(orderId)
                    .then(() => res.send(orderId))
            } else {
                res.status(404).send({message: "Order Not found"})
            }
        }
    )
);

router.put("/:id/pay", 
    isAuth,
    expressAsyncHandler(
        async (req, res) => {
            const updatedData={
                ...req.body,
                isPaid: true,
                paidAt: Date.now()
            }
            Order 
                .findByIdAndUpdate(req.params.id, updatedData, {new:true})
                .then(updatedOrder => res.send({message: "Order Paid", order: updatedOrder}))
                .catch(() => res.status(404).send({message: "Order Not found"}))
        }
    )
);

router.put("/:id/deliver", 
    isAuth,
    isAdmin,
    expressAsyncHandler(
        async (req, res) => {
            const updatedData={
                isDelivered: true,
                deliveredAt: Date.now()
            }
            Order 
                .findByIdAndUpdate(req.params.id, updatedData, {new:true})
                .then(updatedOrder => res.send(updatedOrder))
                .catch((err) => res.status(404).send({message: err}))
        }
    )
);


router.get("/delete",
    expressAsyncHandler(
        async (req, res) => {
            Order
                .deleteMany({})
                .then(() => res.send({message: "deleted all"}))
                .catch(() => res.status(404).send({message: "Order Not found"}))
        }
    )
);

const orderRouter= router

export default orderRouter