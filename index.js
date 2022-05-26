const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const jwt = require("jsonwebtoken");
const logger = require("./logger/logger");
const {check,body, validationResult} = require("express-validator");
;


const corsOptions = {
    origin:'*',
    credentials: true,
    optionSuccessStatus: 200
}

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cors(corsOptions));


const connection = mysql.createConnection({
    host: process.env.DBSERVER,
    user: 'root',
    password: 'vishaly123',
    database: 'ordermanagement'
});

connection.connect((error) => {
  if(error) throw error
  console.log('database now connected');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    logger.info(`server listening port ${port}`);
    console.log(`server listening port ${port}`);
});

const genericError ="something went worng"

let middleware = (req, res, next) =>{
    console.log("middleware");
    next();
}

let authenticate = (req, res, next) => {
    try{
        console.log("authenticate");
       // const token = req.headers.authorization.split("authenticate");
        const token = req.header("authenticate");
    //    console.log(token);
        if(!token)
           return res.status(403).send({
                error: true,
                message: "token not available"
            });
        const decoded = jwt.verify(token,process.env.JWTKEY);
        req.users = decoded;
        next();

    }catch(error){
        res.status(400).send({
            error: true,
            message:"your not authenticated"
        })

    }
}
let autherize = (req, res, next) =>{
   
    let user = req.users;
    let userName = user.username;
    // console.log(userName);
    try{
    connection.query(`select userName,roleName  from users as us join userRole as ur on us.cus_id = ur.cus_id
    join role as rol on rol.roleId = ur.roleId where roleName = "admin" and userName = ?`,userName,(error, results, field) =>{
    
        if(results.length > 0){
            console.log("autherized");
           next();
        }else{
            logger.error("not autherized");
            return res.status(403).send({
                error: true,
                message: "Not Autherized Person"
            });
        }      
    });
    }catch(error){
        logger.error(error);
            return res.status(403).send({
                error: true,
                message: "Not Autherized Person"
            });
    }    
}

app.use(middleware);


// app.post('/login',[
//     body('username').isEmail().withMessage('enter valid email'),
//     body('password').isLength({min: 3}).withMessage('enter valid password')
// ],
//  (req, res)=>{
//     let secretKey = process.env.JWTKEY;
//     let Time = process.env.KEYEXPIRE;
//     let username = req.body.username;
//     let password = req.body.password;
       
//     const errors = validationResult(req);
//     if(!errors.isEmpty()){
//         return res.status(400).send({
//             errors: errors.array()
//         })
//     }else if(errors.isEmpty()){  
         
//         connection.query(`select cs.cus_id, cs.firstName from customerDetails as cs
//         join users as us on us.cus_id = cs.cus_id  where userName = ? and password = ?`,[username,password],
//         (error, results, field)=>{
//             if(results.length > 0){
//                 let userId = results.userId;
//                 let token = jwt.sign({username}, secretKey,{ expiresIn: Time });
//                 res.status(200).send({
//                      error: false,
//                      token: token,
//                      data: results,
//                      expiresIn: Time,
//                      message: 'Token for user' 
//                     });
//             }else{
//                 logger.error("Invalid username or password");
//                 return res.status(400).send({
                    
//                      error: true,
//                      message: 'Invalid username or password '
//                      });
//               }
//         })
//     }

// })

app.post('/login',(req, res)=>{
    let secretKey = process.env.JWTKEY;
    let Time = process.env.KEYEXPIRE;
    let username = req.body.username;
    let password = req.body.password;
       
    try{           
        connection.query(`select cs.cus_id, cs.firstName from customerDetails as cs
        join users as us on us.cus_id = cs.cus_id  where userName = ? and password = ?`,[username,password],
        (error, results, field)=>{
            if(results.length > 0){
                let userId = results.userId;
                let token = jwt.sign({username}, secretKey,{ expiresIn: Time });
                res.status(200).send({
                     error: false,
                     token: token,
                     data: results,
                     expiresIn: Time,
                     message: 'Token for user' 
                    });
<<<<<<< HEAD
            }
        })
    }catch{
        logger.error("Invalid username or password");
        return res.status(400).send({
            
             error: true,
             message: 'Invalid username or password '
    });

=======
            }else{
                return res.status(400).send({
                error: true,
                message: 'Invalid username or password '
            });
            }
        })
    }catch(error){
        logger.error("Invalid username or password");
        return res.status(400).send({
        error: true,
        message: error
    });
>>>>>>> 3f751873c713f89481dab1ff8a4ce2d05d1192f9
    }
})


// 1 qus
app.get('/getallorders',[authenticate], (req, res) => {
    try{
    
    connection.query(`select ord.order_id ,ord.orderDate , cus.firstName, fd.foodNmae, ordd.quantity, ordd.eachPrice,
                      ord.status, pay.paymetType, pay.amount from orders as ord
                      join customerdetails as cus on ord.cus_id = cus.cus_id
                      join orderdetails as ordd on ord.order_id = ordd.order_id
                      join foodmenu as fd on fd.food_id = ordd.food_id
                      join payments as pay on pay.order_id = ord.order_id`
                      ,(error, results, feild) => {
        if(results) {
           return res.status(200).send({
                success: true,
                data: results,
                message:"orders details get successfully"
            });
        } else{
            logger.error("no data found");
           return res.status(400).send({
                success: false,
                message:"no data found"
            });
           }
        });
    }
    catch (error){
        logger.error(genericError);
        return res.status(500).send({
            success: false,
            error: genericError
            });
    }
});

// 2
app.get('/getproductprice/:productid',[authenticate], async (req, res) => {

    // console.log(req.params.productid);
    let productid = req.params.productid;        
    
    try{        

        connection.query(`select fm.foodNmae, ft.foodtype, cat.catagory, prc.buyEach from foodmenu as fm
                          join foodtype as ft on fm.foodtype_id = ft.foodtype_id
                          join foodcatagory as cat on fm.catagory_id = cat.catagory_id
                          join pricetable as prc on prc.food_id = fm.food_id
                          where fm.food_id = ?`,
                      productid,(error, results, feild) => {

        if(results.length >0) {
            
           return res.status(200).send({
                success: true,
                data: results,
                message:"Get food details successfully"
            });
        
        }
        
        else{
            logger.error("no food data found");
            return res.status(400).send({
                success: false,
                message:"no food data found"
            });
           }
        });
    }
    catch (error){
        logger.error(genericError);
        return res.status(500).send({
            success: false,
            error: genericError
            });
    }
});


//3
app.put('/updatepriceofproduct/:productid',[authenticate,autherize], (req, res) => {
    let foodnmae = req.body.foodnmae;
    let HotelNumber = req.body.HotelNumber;
    let catagory_id = req.body.catagory_id;
    let foodtype_id = req.body.foodtype_id;
    let foodsat_id = req.body.foodsat_id;
    let buyEach = req.body.buyEach;
      
    try{
          
        connection.query(`update foodmenu as fm join pricetable as prc on fm.food_id = prc.food_id
                          set fm.foodnmae = ?, fm.HotelNumber = ?,
                          fm.catagory_id = ?, fm.foodtype_id=?, fm.foodsat_id=?, prc.buyEach = ?
                          where fm.food_id= ?`,
        [ foodnmae, HotelNumber, catagory_id, foodtype_id, foodsat_id,buyEach,req.params.productid],(error, results, feild) => {
        if(results) {
            return res.status(200).send({
                success: true,
                data: results,
                message: "update successfully"
            });
        } else{
            logger.error("no data found");
            return res.status(400).send({
                success: false,
                message:"no data found"
            });
           }
        });
    }
    catch (error){
        logger.error(genericError);
        return res.status(500).send({
            success: false,
            error: genericError
            });
    }
});

// 4
app.post('/createnewproduct',[authenticate,autherize], (req, res) => {
   
    try{   
        connection.query(
        `insert into foodmenu (food_id, foodnmae, HotelNumber, catagory_id, foodtype_id, foodsat_id ) values (?,?,?,?,?,?)`,
        [req.body.food_id, req.body.foodnmae, req.body.HotelNumber, req.body.catagory_id, req.body.foodtype_id, req.body.foodsat_id],
       
        (error,results, field) => {
        if(results.affectedRows > 0) {
        connection.query(
            `insert into pricetable(food_id, HotelNumber, buyEach, fromDate, toDate, createDate, updateDate) values(?,?,?,?,?,?,?)`,
        [req.body.food_id, req.body.HotelNumber,req.body.buyEach,req.body.fromDate,req.body.toDate,req.body.createDate,req.body.updateDate],

        (error,results, field) => {
        
        if(results) {
            
           return res.status(200).send({
                success: true,
                data: results,
                message: "create successfully"
            });
        } else{
            logger.error("price create faild");
            return res.status(400).send({
                success: false,
                message:" price create faild"
            });
           }
        })
    }
        });
    }
    catch (error){
        logger.error(genericError);
        return res.status(500).send({
            success: false,
            error: genericError
            });
    }
});

// 5
app.get('/searchorder/:orderid',[authenticate],async (req, res) => {
    
    try{
        let orderid = req.params.orderid;
    connection.query(`select ord.order_id, ord.orderDate , cus.firstName, fd.foodNmae, ordd.quantity, ordd.eachPrice,
                      ord.status, pay.paymetType, inv.totalAmount from orders as ord
                      join customerdetails as cus on ord.cus_id = cus.cus_id
                      join orderdetails as ordd on ord.order_id = ordd.order_id
                      join foodmenu as fd on fd.food_id = ordd.food_id
                      join payments as pay on pay.order_id = ord.order_id
                      join inVoiceHeader as inv on inv.order_id = ord.order_id
                      where ord.order_id = ?`,
                      orderid,(error, results, feild) => {
        if(results.length> 0) {
            return res.status(200).send({
                success: true,
                data: results,
                message:"get single order successfully"
            });
        } else{
            logger.error("no data found");
            return res.status(400).send({
                success: false,
                message:"no data found"
            });
           }
        });
    }
    catch (error){
        logger.error(genericError);
        return res.status(500).send({
            success: false,
            error: genericError
            });
    }
});

// 6

app.post('/createorder',[authenticate,autherize],async (req, res) => {  

    try{    
    
    let items = req.body.items;   
    let sum = 0;
    items.some((item)=>{
        connection.query(`select buyEach from pricetable where food_id= ?`, item.food_id, 
    (error, results, field)=>{
        let obj = JSON.stringify(results);     
        let obj2 = JSON.parse(obj);
        obj2.some((get)=>{ 
           let total = item.quantity*get.buyEach;        
            sum += total;
        })})
    })  
   
    connection.query(`insert into orders(cus_id, HotelNumber)
    values(?,?)`,[req.body.cus_id, req.body.HotelNumber],
    (error, results, field) => {
    let order_id = results.insertId;
    
    if(results.affectedRows > 0){ 
    
     
    for(let item of items){
            
    connection.query(`select buyEach from pricetable where food_id= ?`, item.food_id, 
    (error, results, field)=>{
        let obj = JSON.stringify(results);     
        let obj2 = JSON.parse(obj);
        obj2.some((get)=>{           
 
    if(results){
    
    connection.query(`insert into orderdetails(order_id,food_id,quantity, eachPrice) values(?,?,?,?)`,
    [order_id,item.food_id, item.quantity, get.buyEach],
    (error,results, field) => {
     

     if(results.affectedRows>0){  
    connection.query(`insert into inVoiceDetail(order_id, food_id, quantity, unitId, eachAmount) values(?,?,?,?,?)`,
        [order_id, item.food_id, item.quantity, item.unitId, get.buyEach],
        (error, results4, feild) => {
      
    if(results4.affectedRows>0) {
        
    connection.query(`update foodquantity set balance = balance - ? where food_id = ?`,
        [item.quantity,item.food_id],
        (error, results, feild) => {
                isSuccess = true;          
                        })
                }})
         }})
        }
    })})
    }
  
    connection.query(`insert into payments(order_id, HotelNumber, paymetType, amount) values(?,?,?,?)`,
    [order_id, req.body.HotelNumber, req.body.paymentType, sum],
    (error, results, field) => {     

    if(results.affectedRows>0){

    connection.query(`insert into inVoiceHeader(order_id, cus_id, totalAmount) values(?,?,?)`,
    [order_id, req.body.cus_id, sum],
    (error, results, field) => {
    
        if(results.affectedRows > 0){
            return res.status(200).json({
                success: true,
                message:"create order successfully"
            });

        }
    })
            }})
    }});
    
   
    }
    catch (error){
       logger.error(error);
       return res.status(500).json({
            success: false,
            error: genericError,
            message:"create order fail"
            });
    }
});



// 7
app.post('/cancelorder/:orderid',[authenticate,autherize],async (req, res) => {
    
    try{
        
    connection.query(`update orders ord join orderdetails ordd on ord.order_id = ordd.order_id
    join payments pay on pay.order_id = ord.order_id
    join pricetable prc on prc.food_id = ordd.food_id
    join inVoiceDetail inv on ordd.order_id = inv.order_id
    join foodquantity fq on fq.food_id = inv.food_id set 
    ord.status = ?, fq.balance = fq.balance + inv.quantity
    where ord.order_id= ?`,
    [req.body.status,req.params.orderid],(error, results, feild) => {

    
        
        if(results) {
            return res.status(200).send({
                success: true,
                data: results,
                message:"cancel the order successfully"
            });
        } else{
            logger.error("cancel order faild");
            return res.status(400).send({
                success: false,
                message:"cancel order faild"
            });
           }
           
        });
    }
    catch (error){
        logger.error(genericError);
        return res.status(500).send({
            success: false,
            error: genericError
            });
    }
});


// ## 8 qus
app.post('/updatepriceforallproducts',[authenticate,autherize],async (req, res) => {  

    let amount = req.body.amount;
    let food_id = req.body.food_id;
    try{
    console.log(req.body);
    connection.query(
        `update pricetable set buyEach = ? where food_id= ?`,
    [amount, food_id],(error, results, feild) => {
        
        if(results) {
            res.status(200).send({
                success: true,
                data: results,
                message:"update price successfully"
            });
        } else{
            res.status(404).send({
                success: false,
                message:"update faild faild"
            });
           }
        
        });
    }
    catch (error){
        res.status(500).send({
            success: false,
            error: genericError
            });
    }
});


// 9 

app.delete('/deleteorder/:orderid',[authenticate,autherize],(req, res) => {
    
    try{
    let orderid = req.params.orderid;
    connection.query(`update orders ord join orderdetails ordd on ord.order_id = ordd.order_id
        join payments pay on pay.order_id = ord.order_id
        join pricetable prc on prc.food_id = ordd.food_id
        join inVoiceDetail inv on ordd.order_id = inv.order_id
        join foodquantity fq on fq.food_id = inv.food_id set 
        fq.balance = fq.balance + inv.quantity
        where ord.order_id= ?`,
    orderid,(error, results, feild) => {
        logger.error(error);
    if(results.affectedRows > 0){

    connection.query(` delete from inVoiceDetail where order_id= ?`,
    orderid,(error,results,feild) => {
        logger.error(error);
    if(results.affectedRows > 0){
    connection.query(` delete from inVoiceHeader where order_id= ?`,
    orderid,(error,results,feild) => {
        logger.error(error);
    if(results.affectedRows >0){
    connection.query(`delete from payments where order_id= ?`,
    orderid,(error,results, feild) => {
        logger.error(error);
    if(results.affectedRows>0){
    connection.query(` delete from orderdetails where order_id= ?`,
    orderid,(error,results,feild) => {
        logger.error(error);
    if(results.affectedRows>0){
    connection.query(` delete from orders where order_id= ?`,
    orderid,(error, results, feild) => {
        
        logger.error(error);
        if(results.affectedRows > 0) {
            return res.status(200).send({
                success: true,
                data: results,
                message:"delete the order successfully"
            });
        } else{
            logger.error("delete failed");
            return res.status(400).send({
                success: false,
                message:"delete faild"
            });
           }
                    })
       }   })
      }  })
    } });
     } });
    } });
    }
    catch (error){
        logger.error(genericError);
        return res.status(500).send({
            success: false,
            error: genericError
            });
    }
});

// 10

app.post('/genearatesalesreport',[authenticate],async (req, res) => {
    try{
    
    connection.query(
        `select cus.firstName, sal.Name as repName, ord.deliveredDate, ord.status,
        ordd.quantity, ordd.eachPrice, fm.foodNmae, pay.amount
        from customerdetails as cus join salesperson as sal on cus.sal_person = sal.sal_person
        join orders as ord on ord.cus_id = cus.cus_id
        join orderdetails as ordd on ordd.order_id = ord.order_id
        join foodmenu as fm on fm.food_id = ordd.food_id
        join payments as pay on pay.order_id = ord.order_id  where ord.deliveredDate between ? and ?`,
        [req.body.fromdate, req.body.todate ],(error, results, feild) => {
        if(results) {
            return res.status(200).send({
                success: true,
                data: results,
                message:"sales report generate successfully"
            });
        } else{
            logger.error("report generate faild");
            return res.status(400).send({
                success: false,
                message:"report generate faild"
            });
           }
        
        });
    }
    catch (error){
        logger.error(genericError);
        return res.status(500).send({
            success: false,
            error: genericError
            });
    }
});

app.get('/getHotelName', (req, res) => {
    try{
    
    connection.query(`select HotelNumber, HotelName from hoteldetails`
                      ,(error, results, feild) => {
        if(results) {
           return res.status(200).send({
                success: true,
                data: results,
                message:"Hotel Name get successfully"
            });
        } else{
            logger.error("no data found");
           return res.status(400).send({
                success: false,
                message:"no data found"
            });
           }
        });
    }
    catch (error){
        logger.error(genericError);
        return res.status(500).send({
            success: false,
            error: genericError
            });
    }
});

app.post('/getFood', (req, res) => {
    try{
    
    connection.query(`select fm.food_id,fm.foodNmae, pt.buyEach from hoteldetails as ht
                    join foodMenu as fm on ht.HotelNumber= fm.HotelNumber
                    join foodType as ft on fm.foodtype_id = ft.foodtype_id 
                    join priceTable as pt on pt.food_id = fm.food_id
                    where hotelName=?`,
                      [req.body.hotelName],(error, results, feild) => {
        if(results) {
           return res.status(200).send({
                success: true,
                data: results,
                message:"food details get successfully"
            });
        } else{
            logger.error("no data found");
           return res.status(400).send({
                success: false,
                message:"no data found"
            });
           }
        });
    }
    catch (error){
        logger.error(genericError);
        return res.status(500).send({
            success: false,
            error: genericError
            });
    }
});