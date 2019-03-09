var express=require('express');
var router=express.Router();

router.post('/login',(req,res)=>{
   
    let login_data={
        email:req.body.email,
        password:req.body.password
    }
    
    if(login_data.email!="" && login_data.password!=""){
    
        let sql="SELECT * FROM customer WHERE email='"+login_data.email+"' AND password='"+login_data.password+"'";
       
        req.db.query(sql,(err,result)=>{
            if(err){
                res.status(500).send(err)
            };

            res.send(result)
        })
    }
    else{
        res.send({status:false,message:'Invalid Email/Password!'})
    }
})


router.post('/signup')

module.exports=router;