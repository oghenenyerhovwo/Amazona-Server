// Requiring node modules
import express from "express"
import cors from "cors"
import dotenv from "dotenv"

// importing functions
import databaseConnection from "./connections/dbConnection.js"; 

// importing routers
import userRouter from "./routers/userRouter.js";
import productRouter from "./routers/productRouter.js";
import orderRouter from "./routers/orderRouter.js";
import uploadRouter from "./routers/uploadRouter.js";


// Initializing imported functions
dotenv.config()
const app = express();
databaseConnection()

// middle-wares
app.use(cors())
app.use(express.json())


// router implementations
app.use("/api/uploads", uploadRouter)
app.use("/api/users", userRouter)
app.use("/api/products", productRouter)
app.use("/api/orders", orderRouter)
app.get("/api/config/payPal", (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || "sb")
}); 

app.get("/", (req, res) => {
  res.send("Server is running")
});

// middleware
app.use((err, req,res,next) => {
  res.status(505).send({message: err.message})
  // next()
})

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server at http://localhost:${port}`)
})
