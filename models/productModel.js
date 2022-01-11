import mongoose from "mongoose"

const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});
ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});


const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    seller: {
        type: Schema.Types.ObjectId,
        ref: "User" ,
        required:true,
    },
    image: [ImageSchema],
    brand: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    countInStock: {
        type: Number,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
    numReviews: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true,
});

const Product  = mongoose.model("Product", productSchema);

export default Product