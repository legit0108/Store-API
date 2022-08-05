const { geoSearch } = require('../models/product')
const Product = require('../models/product')

// hardcoding name , other property values 
const getAllProductsStatic = async(req,res) =>{
 const products = await Product.find({})
 res.status(200).send({products,totalHits:products.length})
}

const getAllProducts = async(req,res) =>{
 const queryObj = req.query
 const {featured,company,name,sort,fields} = queryObj
 const queryObject ={}

 if(featured){
    queryObject.featured = (featured==='true')?true:false  
 }

 if(company){
    queryObject.company = company;
 }

 if(name){
    queryObject.name = {$regex: name, $options: 'i'}
 }

 let result = Product.find(queryObject)

 if(sort){
   const sortList = sort.split(',').join(' ')
   result = result.sort(sortList)
 }else result = result.sort('createdAt')

 if(fields){
   const fieldsList = fields.split(',').join(' ')
   result = result.select(fieldsList)
 }

 const page = Number(queryObj.page) || 1
 const limit = Number(queryObj.limit) || 10
 const skip = (page-1)*limit

 result = result.skip(skip).limit(limit)

 const products = await result
 res.status(200).json({products,totalHits:products.length})
}

module.exports = {
    getAllProducts,
    getAllProductsStatic
}