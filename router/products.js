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

const getProductAttribute=(product_id)=>new Promise(resolve=>{
    req.db.query('SELECT attribute_value_id FROM product_attribute WHERE product_id='+product_id,(errs,attribs)=>{
        if(attribs){
            let attribute={};
            attribs.map((item,indx)=>{
                req.db.query('SELECT * FROM attribute_value WHERE attribute_value_id='+item.attribute_value_id,(issue,attribRef)=>{
                    if(attribRef){
                        req.db.query('SELECT * FROM attribute WHERE attribute_id='+attribRef[0].attribute_id,(jhamela,attribNames)=>{
                            if(attribNames){
                                attribute[attribNames[0].name]=attribRef[0].value;

                                if(indx==attribs.length-1){
                                    resolve(attribute)
                                }
                            }
                        })
                    }
                })
            })
            
            
        }
    })
})

function randSize(){
    let sizes=['S','M','L','XL','XXL'];
    var x = Math.floor(Math.random() * sizes.length);
    return sizes[x];
  }

function randColor(){
    let colors=['White','Black','Red','Orange','Yellow','Green','Blue','Indigo','Purple'];
    var x = Math.floor(Math.random() * colors.length);
    return colors[x];
}

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
                            getProductAttribute(response[0].product_id).then(attribute=>{
                                response[0]=Object.assign({},attribute);
                            })
                            response[0].size=randSize();
                            response[0].color=randColor();
                            
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