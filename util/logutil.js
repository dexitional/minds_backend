const Log = require('../model/log');
const OrderLog = require('../model/orderlog');
const Product = require('../model/product');
const StockLog = require('../model/stocklog');
var moment = require('moment');



module.exports.logwriter = async function (action,user,meta) {
  const data = { action, user, meta, timestamp : moment().format('LLL'), created_at: moment(new Date())}
    if(action && user){
      try{
        const ins = await Log.create(data);
      }catch(err){
        console.log(err);
      }
  }
}

module.exports.logorder = async function (oid,type,mode,cart,client,user,amount) {
  var meta = [];
  if(cart){
    for( v of cart){
      const pt = await Product.findOne({ _id: v._id });
      console.log(pt);
      if(pt) meta.push({ product_name: pt.title, product_id: v._id, amount: ( v.quantity * v.price), quantity: parseInt(v.quantity) })
    }
  }
  const data = { oid, type, mode, meta, user, client, amount, created_at:new Date() }
  if(meta.length > 0){
    try{
      var ins = await OrderLog.create(data);
    }catch(err){ console.log(err); }
  }
}

module.exports.logstock = async function () {
  var meta = [];
  const pt = await Product.find({});
  if(pt){
    for( v of pt){
       meta.push({ product_name: v.title, product_id: v._id, product_price: v.price, quantity: parseInt(v.quantity) })
    }
  }
  const data = { meta, user:'logger', created_at:new Date() }
  if(meta.length > 0){
    try{
      var ins = await StockLog.create(data);
    }catch(err){ console.log(err); }
  }
}