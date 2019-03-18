var express=require('express');
var countries=require('./country.json');
var app=express();
var mysql= require('my-sql')
var product=require('./router/products');
var users=require('./router/users');
const bodyParser = require('body-parser');
var cors  = require('cors');
 
function connectToDB(req,res,next){
    let db = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'tshirtshop'
    });
    db.connect(function(err) {
        if (err) {
          return console.error('error: ' + err.message);
        }
       
        console.log('Connected to the MySQL server.');
        req.db=db;
        next();
      });
}

app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(connectToDB);
app.use('/products',product)
app.use('/users',users);


app.get('/categories/by_department',(req,res)=>{
  let db=req.db;

  db.query('SELECT * FROM department',(err,departments)=>{
    if(err){
      res.status(500).send({status:false,message:err});
    }
    else{
      departments.map((item,indx)=>{
        db.query('SELECT * FROM category where department_id='+item.department_id,(error,category)=>{
          if(error){
            console.log(error);
          }
          else{
            if(category[0].department_id==item.department_id){
              departments[indx].category=category;
            }

            if(indx==departments.length-1){
              res.send(departments);
            }
          }
        })
      })
    }
  })
})




app.listen('5001',()=>console.log("Listening to port 5001"));