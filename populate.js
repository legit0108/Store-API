require('dotenv').config()

const connectDB = require('./db/connect');
const Product = require('./models/product');
const jsonProducts = require('./products.json')

const start = async() =>{
    try{
        await connectDB(process.env.MONGO_URI)
        await Product.deleteMany() // delete all previous products from model , start from scratch
        await Product.create(jsonProducts)  
        console.log('Products inserted')
        process.exit(0) // success , exit the process
    }catch(error){
        console.log(error)
        process.exit(1) // failure
    }
}

start()