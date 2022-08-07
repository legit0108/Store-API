const { geoSearch } = require('../models/product')
const Product = require('../models/product')

// hardcoding name , other property values 
const getAllProductsStatic = async(req,res) =>{
 const products = await Product.find({})
 res.status(200).send({products,totalHits:products.length})
}

const getAllProducts = async(req,res) =>{
 const queryObj = req.query
 const {featured,company,name,sort,fields,numericFilters} = queryObj
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
 
 if(numericFilters) {
   const operatorMap = {
      '>': '$gt',
      '>=': '$gte',
      '=': '$eq',
      '<': '$lt',
      '<=': '$lte'
   }

   const regEx = /\b(<|>|>=|=|<|<=)\b/g
   let filters = numericFilters.replace(regEx,(match)=>`-${operatorMap[match]}-`)
   const options = ['price','rating']

   filters = filters.split(',').forEach((item)=>{
      const[field, operator, value] = item.split('-')
      
      if(options.includes(field)){
         queryObject[field] = { [operator]: Number(value)}
      }
   })
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