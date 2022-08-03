const Product = require('../models/product')

// hardcoding name , other property values 
const getAllProductsStatic = async(req,res) =>{
 const products = await Product.find({})
 res.status(200).send({products,totalHits:products.length})
}

const getAllProducts = async(req,res) =>{
 res.status(200).json({msg:'products route'})
}

module.exports = {
    getAllProducts,
    getAllProductsStatic
}