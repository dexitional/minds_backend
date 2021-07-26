var db = require('../config/database');
var Order = require('../model/order');
var Cart = require('../model/cart');
var Vat = require('../model/vat');
var User = require('../model/user');
var Product = require('../model/product');
var Transaction = require('../model/transaction');
var Category = require('../model/category');
var Customer = require('../model/customer');
var Restock = require('../model/restock');
var Request = require('../model/request');
var bcrypt = require('bcrypt');
var moment = require('moment');
const { weekdays } = require('moment');
var async = require('async');


module.exports = {

    fetchProductHistory : async (req,res) => {
        var id = req.params.productId;
        try{
            var history = await Cart.find({product:id}).populate('product order').lean();
            if(history){
                history = history.map((row) => {
                    row.created_at = moment(row.order.created_at).format('LLL');
                    return row;
                })
                res.status(200).json({success:true, data: history});
            }else{
                res.status(202).json({success:false, data: null, msg:"Something wrong happend!"});
            }
        }catch(e){
            res.status(403).json({success:false, data: null, msg: e});
        }
    },

    fetchOrders : async (req,res) => {
        try{
            var orders = await Order.find().sort({oid:-1}).populate('Cart').lean();
            if(orders){
                orders = orders.map((order) => {
                    order.created_at = moment(order.created_at).format('LLL');
                    return order;
                })
                console.log(orders);
                res.status(200).json({success:true, data: orders});
            }else{
                res.status(202).json({success:false, data: null, msg:"Something wrong happend!"});
            }
        }catch(e){
            res.status(403).json({success:false, data: null, msg: e});
        }
    },

    fetchOrder : async (req,res) => {
        var id = req.params.id;
        try{
            var order = await Order.findById({_id:id}).populate('Cart').lean();
            if(user){
                order.created_at = moment(order.created_at).format('LLL');
                res.status(200).json({success:true, data: order});
            }else{
                res.status(202).json({success:false, data: null, msg:"Something wrong happend!"});
            }
        }catch(e){
            res.status(403).json({success:false, data: null, msg: e});
        }
    },

    saveOrder : async (req,res) => {
        try{
           req.body._id = db.Types.ObjectId;
           var data = req.body.cart; delete req.body.cart;
           var carts = [];
           if(data && data.length > 0){
             for(var cart of data){
               // Insert Cart Items
               cart.order = req.body._id;
               await Cart.create(cart);
             }
           }
           // Insert Order
           var ins = await Order.create(req.body);
           if(ins){
             res.status(200).json({success:true, data: ins});
           }else{
             res.status(202).json({success:false, data: null, msg:"Something wrong happend!"});
           }
        }catch(e){
            res.status(403).json({success:false, data: null, msg: e.toSring()});
        }
    },

    updateOrder : async (req,res) => {
        var id = req.params.id;
        try{
            var data = req.body.cart; 
            delete req.body.cart;
            var carts = [];
            if(data && data.length > 0){
              for(var cart of data){
                // Insert Cart Items
                cart.order = req.body._id;
                await Cart.create(cart);
              }
            }
            var ins = await User.findByIdAndUpdate({_id: id},req.body);
            if(ins){
              res.status(200).json({success:true, data: ins});
            }else{
              res.status(202).json({success:false, data: null, msg:"Something wrong happend!"});
            }
         }catch(e){
             res.status(403).json({success:false, data: null, msg: e.toSring()});
         }
    },

    deleteOrder : async(req,res) => {
        var id = req.params.id;
        try{
           var inx = await Cart.deleteMany({order: id}).exec();
           var ins = await Order.deleteOne({_id: id}).exec();
           if(ins && inx){
             res.status(200).json({success:true, data: ins});
           }else{
             res.status(202).json({success:false, data: null, msg:"Something wrong happend!"});
           }
        } catch(e){
          res.status(403).json({success:false, data: null, msg: e});
        }
    },

    deleteOrderOid : async(req,res) => {
        var id = req.params.id;
        try{
           var ins = await Order.deleteOne({oid: id}).exec();
           if(ins){
              var inx = await Cart.deleteMany({order: ins._id}).exec();
           } 
           if(ins && inx){
             res.status(200).json({success:true, data: ins});
           }else{
             res.status(202).json({success:false, data: null, msg:"Something wrong happend!"});
           }
        } catch(e){
          res.status(403).json({success:false, data: null, msg: e});
        }
    },

    setupOrder : async(req,res) => {
        try{
            data = [
              { name:"Software Developer", phone: "0277675089", email: "ebenezerkb.ackah@gmail.com", username: "dexitional", password:bcrypt.hashSync('gloria007',10), location: "Akotokyir", address: "MIS-UCC", allow_access: 1},
            ]
           var ins = await Order.insertMany(data);
           if(ins){
             res.status(200).json({success:true, data: ins});
           }else{
             res.status(202).json({success:false, data: null, msg:"Something wrong happend!"});
           }
        } catch(e){
          res.status(403).json({success:false, data: null, msg: e});
        }
    },

    
    updateOrderDate : async (req,res) => {
        var id = req.query.id;
        var created_at = moment(req.query.date);//,'YYYY-MM-DD HH:MM'
        try{
            var ins = await Order.findByIdAndUpdate({_id: id},{created_at});
            if(ins){
              res.status(200).json({success:true, data: ins});
            }else{
              res.status(202).json({success:false, data: null, msg:"Something wrong happend!"});
            }
         }catch(e){
             res.status(403).json({success:false, data: null, msg: e});
         }
    },

    fetchHelpers : async (req,res) => {
      try{
          // Helpers - Categories, Vat, Products, orders, transactions, customers
          var vats = await Vat.find().exec();
          var categories = await Category.find().sort({title:1}).exec();
          var products = await Product.find().sort({title:1}).exec();
          var transactions = await Transaction.find().sort({tid:-1}).exec();
          var customers = await Customer.find().exec();
          var orders = await Order.find().sort({oid:-1}).populate('Cart').lean();
          if(orders){
              orders = orders.map((order) => {
                  order.created_at = moment(order.created_at).format('LLL');
                  return order;
              })
          }
          res.status(200).json({success:true, data: {vats,customers,categories,transactions,orders,products}});

      }catch(e){
          res.status(403).json({success:false, data: null, msg: e});
      }
  },

  
  rejectedOrders : async (req,res) => {
      try{
          var orders = await Order.find({approval:2,ordertype:'credit'}).sort({oid:-1}).populate('Cart Customer User').lean();
          if(orders){
              orders = orders.map((order) => {
                  order.created_at = moment(order.created_at).format('LLL');
                  return order;
              })
              console.log(orders);
              res.status(200).json({success:true, data: orders});
          }else{
              res.status(202).json({success:false, data: null, msg:"Something wrong happend!"});
          }
      }catch(e){
          res.status(403).json({success:false, data: null, msg: e});
      }
  },


  creditSales : async (req,res) => {
        try{
            var orders = await Order.find({approval:1,ordertype:'credit'},null,{sort:{_id:-1}}).lean();
            if(orders){
                orders = await Promise.all(orders.map(async (order) => {
                
                    order.created_at = moment(order.created_at).format('LLL').toUpperCase();
                    order.cart = await Cart.find({order:order._id}).populate('product').lean();
                    return order;
                }))
                res.status(200).json({success:true, data: orders});
                console.log(orders);
            }else{
                res.status(202).json({success:false, data: null, msg:"Something wrong happend!"});
            }
        }catch(e){
            res.status(403).json({success:false, data: null, msg: e});
        }
  },

  CompleteOrders : async (req,res) => {
      try{
          var orders = await Order.find({completed:1}).sort({oid:-1}).populate('Cart').lean();
          if(orders){
              orders = orders.map((order) => {
                  order.created_at = moment(order.created_at).format('LLL');
                  return order;
              })
              console.log(orders);
              res.status(200).json({success:true, data: orders});
          }else{
              res.status(202).json({success:false, data: null, msg:"Something wrong happend!"});
          }
      }catch(e){
          res.status(403).json({success:false, data: null, msg: e});
      }
  },

  Payments : async (req,res) => {
      try{
          var orders = await Transaction.find({completed:1}).sort({oid:-1}).populate('Order').lean();
          if(orders){
              orders = orders.map((order) => {
                  order.created_at = moment(order.created_at).format('LLL');
                  return order;
              })
              console.log(orders);
              res.status(200).json({success:true, data: orders});
          }else{
              res.status(202).json({success:false, data: null, msg:"Something wrong happend!"});
          }
      }catch(e){
          res.status(403).json({success:false, data: null, msg: e});
      }
  },

  cashSales : async (req,res) => {
    try{  //completed:1,ordertype:credit
        var orders = await Order.find({ordertype:'normal', completed: 1}).sort({oid:-1}).lean();
        if(orders){
            orders = await Promise.all(orders.map(async (order) => {
                
                order.created_at = moment(order.created_at).format('LLL').toUpperCase();
                order.cart = await Cart.find({order:order._id}).populate('product').lean();
                return order;
            }))
            console.log(orders);
            res.status(200).json({success:true, data: orders});
        }else{
            res.status(202).json({success:false, data: null, msg:"Something wrong happend!"});
        }
    }catch(e){
        res.status(403).json({success:false, data: null, msg: e});
    }
  },

  completeSales : async (req,res) => {
    try{  //completed:1,ordertype:credit
        var orders = await Order
        .find({
            $or:[
                { $and: [{completed: 1}, {ordertype: 'normal'}] },
                { $and: [{completed: 1}, {ordertype: 'credit'},{approval: 1}] },
            ]
        })
        .sort({oid:-1})
        .lean();
        if(orders){
            orders = await Promise.all(orders.map(async (order) => {
                
                order.created_at = moment(order.created_at).format('LLL').toUpperCase();
                order.cart = await Cart.find({order:order._id}).populate('product').lean();
                return order;
            }))
            console.log(orders);
            res.status(200).json({success:true, data: orders});
        }else{
            res.status(202).json({success:false, data: null, msg:"Something wrong happend!"});
        }
    }catch(e){
        res.status(403).json({success:false, data: null, msg: e});
    }
  },

  dailySales : async (req,res) => {
    try{  //completed:1,ordertype:credit
        
        const today = moment().startOf('day')
        var orders = await Order
        .find({
            $and: [
              { $or:[
                    { $and: [{completed: 1}, {ordertype: 'normal'}] },
                    { $and: [{completed: 1}, {ordertype: 'credit'},{approval: 1}] },
                ] 
              },
              { created_at: {
                   $gte: today.toDate(),
                   $lte: moment(today).endOf('day').toDate()
                }
              }
            ] 
        })
        .sort({oid:-1})
        .lean();
        if(orders){
            orders = await Promise.all(orders.map(async (order) => {
                
                order.created_at = moment(order.created_at).format('LLL').toUpperCase();
                order.cart = await Cart.find({order:order._id}).populate('product').lean();
                return order;
            }))
            console.log(orders);
            res.status(200).json({success:true, data: orders});
        }else{
            res.status(202).json({success:false, data: null, msg:"Something wrong happend!"});
        }
    }catch(e){
        res.status(403).json({success:false, data: null, msg: e});
    }
  },

  rejectSales : async (req,res) => {
    try{  //{completed: 1, approval: 2}
        var orders = await Order.find({completed: 1, approval: 2}).sort({oid:-1}).lean();
        if(orders){
            orders = await Promise.all(orders.map(async (order) => {
                
                order.created_at = moment(order.created_at).format('LLL').toUpperCase();
                order.cart = await Cart.find({order:order._id}).populate('product').lean();
                return order;
            }))
            console.log(orders);
            res.status(200).json({success:true, data: orders});
        }else{
            res.status(202).json({success:false, data: null, msg:"Something wrong happend!"});
        }
    }catch(e){
        res.status(403).json({success:false, data: null, msg: e});
    }
  },

  paidSales : async (req,res) => {
    try{  //{completed: 1, approval: 2}
        var orders = await Transaction.find({status: 1}).sort({oid:-1}).populate('order').lean();
        if(orders){
            orders = await Promise.all(orders.map(async (order) => {
                order.created_at = moment(order.created_at).format('LLL').toUpperCase();
                return order;
            }))
            console.log(orders);
            res.status(200).json({success:true, data: orders});
        }else{
            res.status(202).json({success:false, data: null, msg:"Something wrong happend!"});
        }
    }catch(e){
        res.status(403).json({success:false, data: null, msg: e});
    }
  },

  receipt : async (req,res) => {
    var id = req.params.id;
    try{  //completed:1,ordertype:credit
        var order = await Order.findOne({oid:id}).sort({oid:-1}).lean();
        if(order){
            order.created_at = moment(order.created_at).format('LLL').toUpperCase();
            order.cart = await Cart.find({order:order._id}).populate('product').lean();
            res.status(200).json({success:true, data: order});
        }else{
            res.status(202).json({success:false, data: null, msg:"Something wrong happend!"});
        }
    }catch(e){
        res.status(403).json({success:false, data: null, msg: e});
    }
  },


  draftOrders : async (req,res) => {
    try{  //completed:1,ordertype:credit
        var orders = await Order.find({completed:0, ordertype:'credit'}).sort({oid:-1}).lean();
        if(orders){
            orders = await Promise.all(orders.map(async (order) => {
                
                order.created_at = moment(order.created_at).format('LLL').toUpperCase();
                order.cart = await Cart.find({order:order._id}).populate('product').lean();
                return order;
            }))
            res.status(200).json({success:true, data: orders});
        }else{
            res.status(202).json({success:false, data: null, msg:"Something wrong happend!"});
        }
    }catch(e){
        res.status(403).json({success:false, data: null, msg: e});
    }
  },


  updateDraftOrder : async (req,res) => {
      var id = req.params.id;
      console.log(req.body);
      try{
          var data;
          if(req.body.action == 'approve'){
             data = { approval : 1, completed: 1 }
          }else{
             data = { approval : 2, completed: 1 }
          }
          var ins = await Order.findByIdAndUpdate({_id: id},data);
          if(ins){
            var cart = await Cart.find({order: id}).populate('product').lean();
            if(cart && cart.length > 0){
                for(var ct of cart){
                    var reduce_result = await Product.findByIdAndUpdate({_id:ct.product._id},{quantity:ct.product.quantity-ct.quantity})
                }
            }
           /* 
            // Transaction & Payment
            var paydata = {
               user:req.body.user,
               order : ins._id,
               tid : moment(new Date()).unix(),
               amount_charge : ins.amount,
               paymode: 'credit',
            }; var pay = await Transaction.create(paydata);
            */
           res.status(200).json({success:true, data: ins});
          
          }else{
            res.status(202).json({success:false, data: null, msg:"Something wrong happend!"});
          }
        }catch(e){
            res.status(403).json({success:false, data: null, msg: e});
        }
  },

  /* POS  */
  cashOrder : async (req,res) => {
        try{
            // Order 
            var orderdata = {
                user:req.body.user,
                oid : moment().unix(),
                amount : req.body.amount,
                refname : req.body.refname,
                discount: 0,
                tax: 0,
                ordertype: 'normal',
                approval: 1,
                completed : 1,
                created_at: moment(new Date())
            };

            var order_result = await Order.create(orderdata);
            if(order_result){
                // Cart
                var cart = req.body.cart;
                var cartArray = []
                var productArray = []
                var errorCount = 0

                if(cart && cart.length > 0){
                    for(var ct of cart){
                        // Insert Cart Items
                        let cartdata = { product: ct._id, order: order_result._id, price: ct.price, amount: ct.price*ct.quantity, discount: 0.0, tax: 0.0, quantity: ct.quantity }
                        //var cart_result = await Cart.create(cartdata);
                        cartArray.push({
                           insertOne: { document: cartdata }
                        })
                        
                        // Reduce Stock
                        var product = await Product.findOne({_id:ct._id}).lean();
                        if(product){
                            let qty = product.quantity - ct.quantity;
                            if(qty >= 0) {
                              //await Product.findByIdAndUpdate({_id:ct._id},{quantity:qty})
                              productArray.push({
                                updateOne: {
                                  filter: {_id:ct._id},
                                  update: { quantity:qty}
                                }
                              })
                            } else {
                               errorCount += 1;
                            }
                        }else{ 
                            errorCount += 1;
                        }
                    }
                }

                if(errorCount <= 0){
                    // Create Cart
                    if(cartArray.length > 0) {
                       await Cart.bulkWrite(cartArray);
                    }
                    // Update Products
                    if(productArray.length > 0) {
                       await Product.bulkWrite(productArray);
                    }
                    // Transaction & Payment
                    var paydata = {
                        user:req.body.user,
                        order : order_result._id,
                        tid : moment(new Date()).unix(),
                        amount_charge : req.body.amount,
                        paymode: 'cash',
                        created_at: moment(new Date())
                    };
                    await Transaction.create(paydata);
                    res.status(200).json({success:true, data: order_result});

                }else{
                    // Errors - Revoke Order
                    await Order.deleteOne({_id:order_result._id});
                    res.status(202).json({success:false, data: null, msg:"Some products are out of Stock!"});
                }
            }else{
                res.status(202).json({success:false, data: null, msg:"Sales order failed!"});
            }
        }catch(e){
            console.log(e);
            res.status(403).json({success:false, data: null, msg: "System error occurred!"});
        }
  },

  updateSale : async (req,res) => {
     var id = req.params.id;
     try{
        var cartArray = []
        var productDataAdd = []
        var productDataReduce = [];
        var productData = [];
        var errorCount = 0
        // OLD CART
        var kart = await Cart.find({order:id}).lean();
        if(kart && kart.length > 0){
            for(var ct of kart){
              var product = await Product.findOne({_id:ct.product}).lean();
              if(product){
                //const qty = parseInt(product.quantity) + parseInt(ct.quantity);
                /*
                productDataAdd.push({
                  updateOne: {
                    filter: { _id:product._id },
                    update: { quantity:qty }
                  }
                })
                */
                var isRec = productData.findIndex(pr => pr.id === ct.product);
                console.log(isRec);
                if(isRec > -1){
                  productData[isRec]['quantity'] = parseInt(productData[isRec]['quantity']) + parseInt(ct.quantity);
                }else{
                  productData.push({
                    id: product._id,
                    quantity : parseInt(product.quantity) + parseInt(ct.quantity),
                  })
                  console.log(`Initial : [ ${product._id} : ${parseInt(product.quantity)} ]`);
                  console.log(`Final : [ ${product._id} : ${parseInt(product.quantity) + parseInt(ct.quantity)} ]`);
                  console.log(`Cart QTy : [ ${product._id} : ${parseInt(ct.quantity)} ]`);
                  console.log(`Store : [ ${product._id} : ${productData[0].quantity} ]`);
                }
              }   
            }
        }
        
        // NEW CART
        var cart = req.body.cart;
        if(cart && cart.length > 0){
            cartArray.push({
               deleteMany: { filter: { order:id } }
            })
            for(var ct of cart){
                
                let cartdata = { product:ct._id, order:id, price:ct.price, amount: parseInt(ct.price*ct.quantity), discount: 0.0, tax: 0.0, quantity: ct.quantity }
                cartArray.push({
                   insertOne: { document: cartdata }
                })

                var product = await Product.findOne({_id:ct._id}).lean();
                if(product){
                    const isRec = productData.findIndex(pr => pr.id === ct.product);
                    console.log(isRec);
                    if(isRec > -1){
                        console.log(`Initial : [ ${productData[isRec]['id']} : ${productData[isRec]['quantity']} ]`);
                        productData[isRec]['quantity'] = parseInt(productData[isRec]['quantity']) - parseInt(ct.quantity);
                        console.log(`Final: [ ${productData[isRec]['id']} : ${productData[isRec]['quantity']} ]`);
                    }else{
                        productData.push({
                            id: product._id,
                            quantity : parseInt(product.quantity) - parseInt(ct.quantity)
                        })
                        console.log(` Test : ${product._id} : ${parseInt(product.quantity) - parseInt(ct.quantity)}`);
                    }
                    /*if(qty >= 0) {
                      
                      productDataReduce.push({
                        updateOne: {
                            filter: { _id:product._id },
                            update: { quantity:qty }
                        }
                      })
                     
                    }else {
                      errorCount += 1;
                    }*/
                }else{ 
                   errorCount += 1;
                }
            }
        }

        for(var p of productData){
            if(parseInt(p.start+p.value) > 0){
                productDataAdd.push({
                    updateOne: {
                        filter: { _id:p.id },
                        update: { quantity: parseInt(p.start+p.value) }
                    }
                })
            }else{
                errorCount += 1;
            }
        }



        if(errorCount <= 0){
            if(productDataAdd.length > 0 ) {
                console.log("Product Add Back :")
                console.log(productDataAdd);
                var addres = await Product.bulkWrite(productDataAdd);
                console.log(addres) 
            }
           
            if(cartArray.length > 0) {  
               await Cart.bulkWrite(cartArray);
            }
            var order_result = await Order.findOneAndUpdate({_id:id},{amount : req.body.amount},{new:true});
            res.status(200).json({success:true, data: order_result});
            
        }else{
            res.status(202).json({success:false, data: null, msg:"Some products are out of Stock!"});
        }
     }catch(e){
         console.log(e);
         res.status(403).json({success:false, data: null, msg:"System error occurred!"});
     }
  },


  returnSales : async (req,res) => {
      var id = req.params.id;
      try{
        var kart = await Cart.find({order:id}).lean();
        if(kart && kart.length > 0){
            var productData = [];
            for(var ct of kart){
                var product = await Product.findOne({_id:ct.product}).lean();
                if(product){
                    const qty = parseInt(product.quantity) + parseInt(ct.quantity);
                    productData.push({
                        updateOne: {
                            filter: {_id:product._id},
                            update: { quantity:qty}
                          } 
                    })
                }   
            }
            if(productData.length > 0) {
                const rs = await Product.bulkWrite(productData);
            }
         }
       
         // Delete Order 
         var order_result = await Order.deleteOne({_id:id});
         if(order_result){
            res.status(200).json({success:true, data: order_result});
         }else{
            res.status(202).json({success:false, data: null, msg:"Something wrong happend!"});
         }
      }catch(e){
            res.status(403).json({success:false, data: null, msg: e});
      }
  },
  

  creditOrder : async (req,res) => {
    try{
        // Order 
        var orderdata = {
            user:req.body.user,
            oid : moment().unix(),
            amount : req.body.amount,
            refname : req.body.refname,
            discount: 0,
            tax: 0,
            ordertype: 'credit',
            approval: 0,
            completed : 0,
            created_at: moment(new Date())
        };
        var order_result = await Order.create(orderdata);
        if(order_result){
            // Cart
            var cart = req.body.cart;
            if(cart && cart.length > 0){
                for(var ct of cart){
                    // Insert Cart Items
                    let cartdata = { product: ct._id, order: order_result._id, price: ct.price, amount: ct.price*ct.quantity, discount: 0.0, tax: 0.0, quantity: ct.quantity }
                    var cart_result = await Cart.create(cartdata);
                }
            }
            
            res.status(200).json({success:true, data: order_result});
        }else{
            res.status(202).json({success:false, data: null, msg:"Something wrong happend!"});
        }
    }catch(e){
        console.log(e);
        res.status(403).json({success:false, data: null, msg: e});
    }
  },



  overview : async (req,res) => {
        var from = req.query.from;
        var to = req.query.to;
        console.log('from:'+from);
        console.log('to:'+to);
        const today = moment().startOf('day')
        
        try{
            var clients = (await Order.find({
                $and: [
                { $or:[
                        { $and: [{completed: 1}, {ordertype: 'normal'}] },
                        { $and: [{completed: 1}, {ordertype: 'credit'},{approval: 1}] },
                    ] 
                },
                { created_at: {
                    $gte: today.toDate(),
                    $lte: moment(today).endOf('day').toDate()
                    }
                }
                ] 
            }).exec()).length;
            var products = (await Product.find().exec()).length;
            var approvals = (await Order.find({approval:0,ordertype:'credit'}).exec()).length;
            var rejected = (await Order.find({approval:2,ordertype:'credit'}).exec()).length;
            var requests = await Request.find({ $and: [
                { status: 1},
                { created_at: {
                    $gte: today.toDate(),
                    $lte: moment(today).endOf('day').toDate()
                    }
                }
                ]}).sort({rid:-1}).populate('product').lean();
            var sales = await Order.find({completed:1,ordertype:'normal'}).sort({oid:-1}).lean();
            var credit = await Order.find({completed:1,ordertype:'credit'}).sort({oid:-1}).lean();
            var orders = await Order.find({
                $or:[
                    { $and: [{completed: 1}, {ordertype: 'normal'}] },
                    { $and: [{completed: 1}, {ordertype: 'credit'},{approval: 1}] },
                ]
            }).sort({oid:-1}).lean();
            var daily = await Order
                .find({
                    $and: [
                    { $or:[
                            { $and: [{completed: 1}, {ordertype: 'normal'}] },
                            { $and: [{completed: 1}, {ordertype: 'credit'},{approval: 1}] },
                        ] 
                    },
                    { created_at: {
                        $gte: today.toDate(),
                        $lte: moment(today).endOf('day').toDate()
                        }
                    }
                    ] 
                })
                .sort({oid:-1})
                .lean();

            if(sales){
                sales = sales.map((order) => {
                    order.created_at = moment(order.created_at).format('LLL');
                    return order;
                })
            }
            if(credit){
                credit = credit.map((order) => {
                    order.created_at = moment(order.created_at).format('LLL');
                    return order;
                })
            }
            if(daily){
                daily = await Promise.all(daily.map(async (order) => {
                    order.created_at = moment(order.created_at).format('LLL').toUpperCase();
                    order.cart = await Cart.find({order:order._id}).populate('product').lean();
                    return order;
                }))
            }
            if(orders){
                orders = orders.map((order) => {
                    order.created_at = moment(order.created_at).format('LLL');
                    return order;
                })
            }   
            
            res.status(200).json({success:true, data: {orders,clients,approvals,rejected,products,sales,credit,requests,daily}});

        }catch(e){
            res.status(403).json({success:false, data: null, msg: e});
        }
  },


  report : async (req,res) => {
    
    var from = req.query.from != '' ? moment(req.query.from).startOf('day').toDate() : moment().startOf('day').toDate();
    var to = req.query.to != '' ? moment(req.query.to).endOf('day').toDate() : moment().endOf('day').toDate();
    const title = (moment(to).diff(moment(from),'days') == 0 ) ? ` ${moment(from).format('MMM DD, YYYY').toUpperCase()}` : `[ FROM : ${moment(from).format('MMM DD, YYYY').toUpperCase()} - TO : ${moment(to).format('MMM DD, YYYY').toUpperCase()} ]`
    
    try{
        // Clients visits
        var clients = (await Order.find({
            $and: [
                { $or:[
                        { $and: [{completed: 1}, {ordertype: 'normal'}] },
                        { $and: [{completed: 1}, {ordertype: 'credit'},{approval: 1}] },
                    ] 
                },
                { created_at: {
                    $gte: from,
                    $lte: to
                  }
                }
            ] 
        }).exec()).length;
 
        // Requisitions
        var requests = await Request.find({ 
            $and: [
                { status: 1},
                { created_at: {
                        $gte: from,
                        $lte: to
                    }
                }
            ]
        }).sort({rid:-1}).populate('product').lean();
        
        // Amount Sold
        var sales = (await Order.find({
            $and: [
                { $or:[
                        { $and: [{completed: 1}, {ordertype: 'normal'}] },
                        { $and: [{completed: 1}, {ordertype: 'credit'},{approval: 1}] },
                    ] 
                },
                { created_at: {
                        $gte: from,
                        $lte: to
                    }
                }
            ] 
        }).sort().lean()).reduce((acc,s) => acc+s.amount,0);

        // Orders Made / Completed Sales
        var orders = await Order
            .find({
                $and: [
                    { $or:[
                            { $and: [{completed: 1}, {ordertype: 'normal'}] },
                            { $and: [{completed: 1}, {ordertype: 'credit'},{approval: 1}] },
                        ] 
                    },
                    { created_at: {
                            $gte: from,
                            $lte: to
                        }
                    }
                ] 
            })
            .sort({oid:-1})
            .lean();

        
        if(orders){
            orders = await Promise.all(orders.map(async (order) => {
                order.created_at = moment(order.created_at).format('LLL').toUpperCase();
                order.cart = await Cart.find({order:order._id}).populate('product').lean();
                order.quantity = order.cart.reduce((acc,ct) => acc+ct.quantity,0);
                return order;
            }))
        }

        // Product Sold
        var products = orders.reduce((acc,order) => acc+order.quantity,0);
        
        

        // Year-long Sales
        var start = moment(new Date(new Date().getFullYear(),0,1)).startOf('day').toDate()
        var end = moment(new Date(new Date().getFullYear(),11,31)).endOf('day').toDate()
        var chartyear = {'JAN':0,'FEB':0, 'MAR':0, 'APR':0, 'MAY':0, 'JUN':0, 'JUL':0, 'AUG':0, 'SEP':0, 'OCT':0,'NOV':0,'DEC':0};
        var yeartitle = `SALES THIS YEAR -- [ ${moment(start).format('MMM DD, YYYY').toUpperCase()} - ${moment(end).format('MMM DD, YYYY').toUpperCase()} ]`;
        var yearorders = await Order
            .find({
                $and: [
                    { $or:[
                        { $and: [{completed: 1}, {ordertype: 'normal'}] },
                        { $and: [{completed: 1}, {ordertype: 'credit'},{approval: 1}] },
                      ] 
                    },
                    { created_at: {
                        $gte: start,
                        $lte: end
                      }
                    }
                ] 
            })
            .sort({oid:-1})
            .lean();
            
        if(yearorders){
             for(var order of yearorders){
                 if(moment(order.created_at).format('MMM').toUpperCase().includes('JAN')){
                    chartyear['JAN'] += order.amount;
                 }else if(moment(order.created_at).format('MMM').toUpperCase().includes('FEB')){
                    chartyear['FEB'] += order.amount;
                 }else if(moment(order.created_at).format('MMM').toUpperCase().includes('MAR')){
                    chartyear['MAR'] += order.amount;
                 }else if(moment(order.created_at).format('MMM').toUpperCase().includes('APR')){
                    chartyear['APR'] += order.amount;
                 }else if(moment(order.created_at).format('MMM').toUpperCase().includes('MAY')){
                    chartyear['MAY'] += order.amount;
                 }else if(moment(order.created_at).format('MMM').toUpperCase().includes('JUN')){
                    chartyear['JUN'] += order.amount;
                 }else if(moment(order.created_at).format('MMM').toUpperCase().includes('JUL')){
                    chartyear['JUL'] += order.amount;
                 }else if(moment(order.created_at).format('MMM').toUpperCase().includes('AUG')){
                    chartyear['AUG'] += order.amount;
                 }else if(moment(order.created_at).format('MMM').toUpperCase().includes('SEP')){
                    chartyear['SEP'] += order.amount;
                 }else if(moment(order.created_at).format('MMM').toUpperCase().includes('OCT')){
                    chartyear['OCT'] += order.amount;
                 }else if(moment(order.created_at).format('MMM').toUpperCase().includes('NOV')){
                    chartyear['NOV'] += order.amount;
                 }else if(moment(order.created_at).format('MMM').toUpperCase().includes('DEC')){
                    chartyear['DEC'] += order.amount;
                 }
            }
        }


        // Week-long Sales
        const week = moment().format('w'); // Week in Year
        //const day = moment().format('e'); // Week day ( 0-6 | Sun-Sat )
        var start = moment(`${week} 0 ${new Date().getFullYear()}`,'w e YYYY').startOf('day').toDate()
        var end = moment(`${week} 6 ${new Date().getFullYear()}`,'w e YYYY').endOf('day').toDate()
        var chartweek = {'MONDAY':0,'TUESDAY':0, 'WEDNESDAY':0, 'THURSDAY':0, 'FRIDAY':0, 'SATURDAY':0, 'SUNDAY':0 };
        var weektitle = `SALES THIS WEEK -- [ ${moment(start).format('ddd MMM DD, YYYY').toUpperCase()}  - ${moment(end).format('ddd MMM DD, YYYY').toUpperCase()} ]`;
        var weekorders = await Order
            .find({
                $and: [
                    { $or:[
                            { $and: [{completed: 1}, {ordertype: 'normal'}] },
                            { $and: [{completed: 1}, {ordertype: 'credit'},{approval: 1}] },
                        ] 
                    },
                    { created_at: {
                            $gte: start,
                            $lte: end
                        }
                    }
                ] 
            })
            .sort({oid:-1})
            .lean();
        if(weekorders){
             for(var order of weekorders){
                 if(moment(order.created_at).format('e') == 1 && moment(order.created_at).format('w') == week){
                    chartweek['MONDAY'] += order.amount;
                 }else if(moment(order.created_at).format('e') == 2 && moment(order.created_at).format('w') == week){
                    chartweek['TUESDAY'] += order.amount;
                 }else if(moment(order.created_at).format('e') == 3 && moment(order.created_at).format('w') == week){
                    chartweek['WEDNESDAY'] += order.amount;
                 }else if(moment(order.created_at).format('e') == 4 && moment(order.created_at).format('w') == week){
                    chartweek['THURSDAY'] += order.amount;
                 }else if(moment(order.created_at).format('e') == 5 && moment(order.created_at).format('w') == week){
                    chartweek['FRIDAY'] += order.amount;
                 }else if(moment(order.created_at).format('e') == 6 && moment(order.created_at).format('w') == week){
                    chartweek['SATURDAY'] += order.amount;
                 }else if(moment(order.created_at).format('e') == 0 && moment(order.created_at).format('w') == week){
                    chartweek['SUNDAY'] += order.amount;
                 }
            }
        }
         
        res.status(200).json({success:true, data: {orders,clients,products,sales,title,chartyear,chartweek,weektitle,yeartitle}});

    }catch(e){
        res.status(403).json({success:false, data: null, msg: e});
    }
},


  request : async (req,res) => {
    console.log(req.body)
    try{
        // Request 
        var cart = [];
        for(var ct of req.body.cart){
            var d = { user:req.body.user, receiver:req.body.user, oid:req.body.oid, product: ct.product._id, quantity: ct.quantity, rid: moment().unix(), created_at: moment(new Date()) }
            cart.push(d);
        }
        var result = await Request.create(cart);
        if(result){
           res.status(200).json({success:true, data: result});
        }else{
           res.status(202).json({success:false, data: null, msg:"Something wrong happend!"});
        }
    }catch(e){
        console.log(e);
        res.status(403).json({success:false, data: null, msg: e});
    }
  },

  fetchRequest : async (req,res) => {
    try{  //completed:1,ordertype:credit
        var requests = await Request.find({status:1}).sort({rid:-1}).populate('product').lean();
        if(requests){
            res.status(200).json({success:true, data: requests});
        }else{
            res.status(202).json({success:false, data: null, msg:"Something wrong happend!"});
        }
    }catch(e){
        res.status(403).json({success:false, data: null, msg: e});
    }
  },

  deleteRequest : async(req,res) => {
    var id = req.params.id;
    try{
       var ins = await Request.deleteOne({_id: id}).exec();
       if(ins){
         res.status(200).json({success:true, data: ins});
       }else{
         res.status(403).json({success:false, data: null, msg:"Something wrong happend!"});
       }
    } catch(e){
      res.status(403).json({success:false, data: null, msg: e});
    }
},



  resetall : async (req,res) => {
    try{
        await Order.deleteMany({}).exec();
        await Cart.deleteMany({}).exec();
        await Transaction.deleteMany({}).exec();
        await Restock.deleteMany({}).exec();
        await Request.deleteMany({}).exec();
        res.status(200).json({success:true, data: "Reset success"});
    
    }catch(e){
        res.status(403).json({success:false, data: null, msg: e});
    }
},









}