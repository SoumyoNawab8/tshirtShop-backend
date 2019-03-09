var express=require('express');
var countries=require('./country.json');
var app=express();
var mysql= require('my-sql')
var product=require('./router/products');
var users=require('./router/users');
const bodyParser = require('body-parser');
 
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

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(connectToDB);
app.use('/products',product)
app.use('/users',users);





app.listen('3000',()=>console.log("Listening to port 3000"));