const express = require('express');
const session = require('express-session');
const cron = require('node-cron');
const mailer = require('nodemailer');
const exec = require("child_process").exec;
const zipFolder = require("zip-folder");
const rimraf = require("rimraf");
const config = require('../config/config.json');
const moment = require('moment');

const { logstock } = require('../util/logutil');
module.exports = (function() {
  
    var app = express.Router();
    var jwt = require('jsonwebtoken');
    app.use(session({
        secret: 'minds', 
        resave: true,
        cookie: { 
            maxAge: 30*60*1000 
        }
    }));

    // Create mail transporter.
    let mail = mailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'hrms@ucc.edu.gh',
            pass: 'gloria007'
        }
    });


    /* Controllers */
    var UserController = require('../controller/userController');
    var productController = require('../controller/productController');
    var flowController = require('../controller/flowController');
    
    const verifyToken = (req,res,next) => {
        const bearerHeader = req.headers['authorization'];
        if(typeof bearerHeader !== 'undefined'){
            const bearer =  bearerHeader.split(' ');
            req.token = bearer[1];
            jwt.verify(bearer[1], 'secret',(err,authData) =>{
                if(err)  res.status(403).json({success:false, data: null, msg: 'Unauthorized access'})
                next();
            })

        }else{
            res.status(403).json({success:false, data: null, msg: 'Unauthorized access'})
        }
    }
    
    /* User Routes */
    app.get('/api/users', UserController.fetchUsers);
    app.get('/api/users/:id', UserController.fetchUser);
    app.post('/api/users', UserController.saveUser);
    app.put('/api/users/:id', UserController.updateUser);
    app.get('/api/users/reset/:id', UserController.resetUser);
    app.delete('/api/users/:id', UserController.deleteUser);
    app.get('/api/users/:id', UserController.fetchUser);
    app.get('/api/setusers', UserController.setupUser);
    app.post('/api/login', UserController.verifyUser);

    /* Customer Routes */
    app.get('/api/clients', UserController.fetchClients);
    app.get('/api/clients/:id', UserController.fetchClient);
    app.post('/api/clients', UserController.saveClient);
    app.put('/api/clients/:id', UserController.updateClient);
    app.delete('/api/clients/:id', UserController.deleteClient);
    

    /* Product Routes */
    app.get('/api/products', productController.fetchProducts);
    app.get('/api/products/:id', productController.fetchProduct);
    app.post('/api/products', productController.saveProduct);
    app.put('/api/products/:id', productController.updateProduct);
    app.delete('/api/products/:id', productController.deleteProduct);
    app.get('/api/setproducts', productController.setupProduct);
    app.get('/api/producthistory/:productId', flowController.fetchProductHistory);

    /* VAT Routes */
    app.get('/api/vats', productController.fetchVats);
    app.get('/api/vats/:id', productController.fetchVat);
    app.post('/api/vats', productController.saveVat);
    app.put('/api/vats/:id', productController.updateVat);
    app.delete('/api/vats/:id', productController.deleteVat);
    app.get('/api/setvats', productController.setupVat);

    /* Categories Routes */
    app.get('/api/cats', productController.fetchCats);
    app.get('/api/cats/:id', productController.fetchCat);
    app.post('/api/cats', productController.saveCat);
    app.put('/api/cats/:id', productController.updateCat);
    app.delete('/api/cats/:id', productController.deleteCat);
    app.get('/api/setcats', productController.setupCat);

    /* Re-Stock Routes */
    app.get('/api/stocks', productController.fetchRestocks);
    app.get('/api/stocks/:id', productController.fetchRestock);
    app.get('/api/loadstock/:id', productController.loadRestock);
    app.post('/api/stocks', productController.saveRestock);
    app.put('/api/stocks/:id', productController.updateRestock);
    app.delete('/api/stocks/:id', productController.deleteRestock);
    
    
    /* Order & Cart Routes */
    app.get('/api/orders', flowController.fetchOrders);
    app.get('/api/orders/:id', flowController.fetchOrder);
    app.post('/api/orders', flowController.saveOrder);
    app.put('/api/orders/:id', flowController.updateOrder);
    app.delete('/api/orders/:id', flowController.deleteOrder);
    app.delete('/api/ordersoid/:id', flowController.deleteOrderOid);
    app.get('/api/setorders', flowController.setupOrder);
    app.get('/api/draftorders', flowController.draftOrders);
    app.put('/api/draftorders/:id', flowController.updateDraftOrder);
    app.get('/api/chgorderdate', flowController.updateOrderDate);
    app.get('/api/cashsales', flowController.cashSales);
    app.get('/api/creditsales', flowController.creditSales);
    app.get('/api/completesales', flowController.completeSales);
    app.get('/api/dailysales', flowController.dailySales);
    app.get('/api/rejectsales', flowController.rejectSales);
    app.get('/api/payments', flowController.paidSales);
    app.get('/api/returnsales/:id', flowController.returnSales);
    app.get('/api/receipt/:id', flowController.receipt);
    app.get('/api/helpers', flowController.fetchHelpers);
    app.post('/api/cashorder', flowController.cashOrder);
    app.put('/api/cashorder/:id', flowController.updateSale);
    app.post('/api/creditorder', flowController.creditOrder);
    app.put('/api/creditorder/:id', flowController.updateSale);
    app.get('/api/overview', flowController.overview);
    app.post('/api/sendrequest', flowController.request);
    app.get('/api/requests', flowController.fetchRequest);
    app.delete('/api/requests/:id', flowController.deleteRequest);
    app.get('/api/resetall', flowController.resetall);

    /* Reports */
    app.get('/api/report', flowController.report);

    /* Logs */
    app.get('/api/logs', flowController.fetchLogs);
    /*app.get('/api/stocklog', flowController.fetchStockLogs);*/
    app.get('/api/stocklogs', flowController.fetchStockLogs);
    app.get('/api/makestocklog', flowController.makeStockLog);
    
    
    /* Schedule tasks  */
   
    // Schedule Stock Log everyday @ midnight
    cron.schedule('45 23 * * *', async function() {
       logstock()
    });

    // Schedule Database Backup everyday @ midnight
    cron.schedule('59 23 * * *', function() {
        const dt = moment().format('DDMMYYYY');
        let data = {
            sender: 'hrms@ucc.edu.gh',
            to: 'dexitional@gmail.com',
            subject: `pjoe.org (backup_${dt})`,
            text: `pjoe.org (backup_${dt})`,
            attachments: []
        }
       
        //remove directory
        rimraf.sync(config.DB_OPTIONS.database);
        //backup mongo
        const pt = __dirname.replace(/ /g,"\\ ")
        const cmd = "mongodump --host "+config.DB_OPTIONS.host+" --db "+config.DB_OPTIONS.database+" --gzip --out "+pt+"/backup"; // Command for mongodb dump process
        //const cmd = "~/_locals/mongodb/bin/mongodump --host "+config.DB_OPTIONS.host+" --db "+config.DB_OPTIONS.database+" --gzip --out "+pt+"/backup"; // Command for mongodb dump process
        exec(cmd, function(error, stdout, stderr) {
            if(error){ console.log(error) }
            else {
                //zip backup
                zipFolder(__dirname+"/backup/"+config.DB_OPTIONS.database, __dirname+"/backup/"+config.DB_OPTIONS.database+'_'+dt+".zip",function(err) {
                    if (err) {
                        console.log("Zip error ... ");
                    } else {
                        console.log("Backup zipped successful");
                        // Options
                        data.attachments = [{ filename: config.DB_OPTIONS.database+'_'+dt+".zip",path: __dirname+"/backup/"+config.DB_OPTIONS.database+'_'+dt+".zip", cid: 'backup'}]
                        // Send Backup as attachment
                        mail.sendMail(data,(err,info)=>{
                          if(err) console.log(err);
                          console.log(info);
                          rimraf(__dirname+"/backup/"+config.DB_OPTIONS.database, function () { console.log("done"); });
                        });
                    }
                });
            }
        });

        
       
  
    });

    return app;

})();