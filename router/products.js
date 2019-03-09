var express=require('express');
var router=express.Router();


router.get('/',function(req,res){
    let sql='SELECT * FROM product';
    req.db.query(sql,(err,result)=>{
    if(err)throw err;

    res.send(result)
    })
})

module.exports=router;