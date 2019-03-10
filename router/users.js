var express=require('express');
var router=express.Router();
var validatefields=require('./helper/validateFields');

const checkAccountExists=(req,res,next)=>{
    if(req.body.email.length>0 && req.body.password.length>0){
        req.db.query('SELECT customer_id FROM customer WHERE email="'+req.body.email+'"',(err,result)=>{
            if(err){
                console.log(err);
            }
            else{
                if(result.length>0){
                    req.userExists=true;
                }
                else{
                    req.userExists=false;
                }
                next();
            }
        })
    }
    else{
        next();
    }
}

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


router.post('/signup',function(req,res,next){
    checkAccountExists(req,res,next);
}
,function(req,res){
    if(validatefields(req.body)){
        if(req.userExists){
            res.send({status:false,message:'User Already Registered!'});
        }
        else{
            req.db.query('INSERT INTO customer (customer_id, name, email, password, credit_card, address_1, address_2, city, region, postal_code, country, shipping_region_id, day_phone, eve_phone, mob_phone) VALUES (null,"'+req.body.name+'","'+req.body.email+'","'+req.body.password+'",NULL,NULL,NULL,NULL,NULL,NULL,NULL,"1",NULL,NULL,NULL)',(err,result)=>{
                if(err){
                    res.send({status:false,message:err});
                }
                else{
                    res.send({status:true,result});
                }
            });
            
        }
        
    }else{
        res.send({status:false,message:"Name,Email and Password Can't be empty"})
    }
})

router.get('/profile/:customer_id',function(req,res){
    req.db.query('SELECT * FROM customer WHERE customer_id='+req.params.customer_id,(err,result)=>{
        if(err){
            res.send({status:false,message:err});
        }
        else{
            res.send({status:true,result});
        }
    })
})


module.exports=router;