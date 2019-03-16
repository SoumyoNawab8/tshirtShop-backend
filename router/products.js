var express=require('express');
var router=express.Router();


router.get('/',function(req,res){
    let sql='SELECT * FROM product';
    req.db.query(sql,(err,result)=>{
    if(err)throw err;

    res.send(result)
    })
})

const getCategoryID=(req,res)=>new Promise(resolve=>{
    let sql='SELECT category_id FROM category WHERE name="'+req.params.categoryName+'"';
    req.db.query(sql,(err,result)=>{
    if(err){
        console.log(err)
        res.status(500).send(err);
    }

    resolve(result[0].category_id)
    })
})


router.get('/:categoryName',function(req,res){
    console.log(req.params.categoryName)
    getCategoryID(req,res).then(category_id=>{
        req.db.query('SELECT product_id from product_category where category_id = '+category_id,(err,result)=>{
            if(err){
                console.log(err)
                res.status(500).send(err);
            }
            else{

                let products=[];
                result.map((product_id,indx)=>{

                    req.db.query('SELECT * FROM product WHERE product_id='+product_id.product_id,(error,response)=>{
                        if(error){
                            res.status(500).send(error);
                        }
                        else{
                            products.push(response[0])

                            if(indx==result.length-1){
                                res.send(products);
                            }
                        }
                    })
                })

            }
        })
    })
})

module.exports=router;