var express=require('express');
var router=express.Router();
var validatefields=require('./helper/validateFields');
var jwt=require('jsonwebtoken');
var passport=require('passport');

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

function authenticateToken(req,res,next){
    jwt.verify(req.body.token,'secret',(err,foo)=>{
        if(!err){
            console.log(foo);
            next();
        }
        else{
            res.status(500).send(err);
        }
    })
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
            
            if(result.length>0){
                jwt.sign({id:result[0].customer_id,name:result[0].name},'secret',{expiresIn:3600},(err,token) =>{
                    res.json({succress:true,result:token})
                })
            }
            else{
                
                res.send({status:false,message:"Email and Password doesn't match!"});
            }
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

router.post('/update_profile',function(req,res,next){
    authenticateToken(req,res,next);
},function(req,res){
    let sql='UPDATE customer SET credit_card="'+req.body.credit_card+'", address_1="'+req.body.address_1+'", address_2="'+req.body.address_2+'" WHERE customer_id='+req.body.customer_id;
    req.db.query(sql,(err,result)=>{
        if(err){
            res.send({status:false,message:err});
        }
        else{
            res.send(result);
        }
    })
})


module.exports=router;