var db = require('../config/database');
var Product = require('../model/product');
var Category = require('../model/category');
var Restock = require('../model/restock');
var Vat = require('../model/vat');
var bcrypt = require('bcrypt');

var moment = require('moment');
const restock = require('../model/restock');
module.exports = {

    fetchProducts : async (req,res) => {
        try{
            var products = await Product.find().populate('vat category').sort({title:1}).exec();
            if(products){
                res.status(200).json({success:true, data: products});
            }else{
                res.status(403).json({success:false, data: null, msg:"Something wrong happend!"});
            }
        }catch(e){
            res.status(403).json({success:false, data: null, msg: e});
        }
    },

    fetchProduct : async (req,res) => {
        var id = req.params.id;
        try{
            var product = await Product.findById({_id:id}).populate('vat category').exec();
            if(product){
                product.created_at = moment(product.created_at).format('LLL');
                res.status(200).json({success:true, data: product});
            }else{
                res.status(403).json({success:false, data: null, msg:"Something wrong happend!"});
            }
        }catch(e){
            res.status(403).json({success:false, data: null, msg: e});
        }
    },

    saveProduct : async (req,res) => {
        console.log(req.body);
        try{
           var ins = await Product.create(req.body);
           if(ins){
             res.status(200).json({success:true, data: ins});
           }else{
             res.status(403).json({success:false, data: null, msg:"Something wrong happend!"});
           }
        }catch(e){
            res.status(403).json({success:false, data: null, msg: e});
        }
    },

    updateProduct : async (req,res) => {
        var id = req.params.id;
        console.log(req.body);
        try{
            var ins = await Product.findByIdAndUpdate({_id: id},req.body);
            if(ins){
              res.status(200).json({success:true, data: ins});
            }else{
              res.status(403).json({success:false, data: null, msg:"Something wrong happend!"});
            }
         }catch(e){
             res.status(403).json({success:false, data: null, msg: e});
         }
    },

    deleteProduct : async(req,res) => {
        var id = req.params.id;
        try{
           var ins = await Product.deleteOne({_id: id}).exec();
           if(ins){
             res.status(200).json({success:true, data: ins});
           }else{
             res.status(403).json({success:false, data: null, msg:"Something wrong happend!"});
           }
        } catch(e){
          res.status(403).json({success:false, data: null, msg: e});
        }
    },

    setupProduct : async(req,res) => {
        try{
            data = [
                {name:"Software Developer", phone: "0277675089", email: "ebenezerkb.ackah@gmail.com", username: "dexitional", password:bcrypt.hashSync('gloria007',10), location: "Akotokyir", address: "MIS-UCC", allow_access: 1},
                {name:"Software Developer", phone: "0244087163", email: "skoku@gmail.com", username: "skoku", password:bcrypt.hashSync('p@ssw0rd1234',10), location: "Akotokyir", address: "MIS-UCC", allow_access: 1}
            ]
           var ins = await Product.insertMany(data);
           if(ins){
             res.status(200).json({success:true, data: ins});
           }else{
             res.status(403).json({success:false, data: null, msg:"Something wrong happend!"});
           }
        } catch(e){
          res.status(403).json({success:false, data: null, msg: e});
        }
    },

    fetchAsyncProducts : async () => {
      try{
          var products = await Product.find().populate('vat category').sort({title:1}).lean();
          if(products){
              products = products.map((row) => {
                  row.max = row.quantity;
                  return row;
              })
              return {success:true, data: products }
          }else{
              return {success:false, data: null, msg:"Something wrong happend!"}
          }
      }catch(e){
          return {success:false, data: null, msg: e }
      }
  },

    /* CATEGORIES */

    fetchCats : async (req,res) => {
        try{
            var cats = await Category.find().sort({title:1}).lean();
            if(cats){
               res.status(200).json({success:true, data: cats});
            }else{
              res.status(202).json({success:false, data: null, msg:"Something wrong happend!"});
            }
        }catch(e){
            res.status(403).json({success:false, data: null, msg: e});
        }
    },

    fetchCat : async (req,res) => {
        var id = req.params.id;
        try{
            var cat = await Category.findById({_id:id}).lean();
            if(cat){
                res.status(200).json({success:true, data: cat});
            }else{
                res.status(202).json({success:false, data: null, msg:"Something wrong happend!"});
            }
        }catch(e){
            res.status(403).json({success:false, data: null, msg: e});
        }
    },

    saveCat : async (req,res) => {
        try{
           var ins = await Category.create(req.body);
           if(ins){
             res.status(200).json({success:true, data: ins});
           }else{
             res.status(202).json({success:false, data: null, msg:"Something wrong happend!"});
           }
        }catch(e){
            res.status(403).json({success:false, data: null, msg: e.toSring()});
        }
    },

    updateCat : async (req,res) => {
        var id = req.params.id;
         console.log(req.body);
        try{
            var ins = await Category.findByIdAndUpdate({_id: id},req.body);
            console.log(ins);
            if(ins){
              res.status(200).json({success:true, data: ins});
            }else{
              res.status(202).json({success:false, data: null, msg:"Something wrong happend!"});
            }
         }catch(e){
             res.status(403).json({success:false, data: null, msg: e});
         }
    },

    deleteCat : async(req,res) => {
        var id = req.params.id;
        try{
           var ins = await Category.deleteOne({_id: id}).exec();
           if(ins){
             res.status(200).json({success:true, data: ins});
           }else{
             res.status(202).json({success:false, data: null, msg:"Something wrong happend!"});
           }
        } catch(e){
          res.status(403).json({success:false, data: null, msg: e});
        }
    },

    setupCat : async(req,res) => {
        try{
           data = [
              {title:"WC", description: "Water Closets", status: 1},
              {title:"Curtains", description: "Bath room curtains", status: 1},
           ]
           var ins = await Category.insertMany(data);
           if(ins){
             res.status(200).json({success:true, data: ins});
           }else{
             res.status(202).json({success:false, data: null, msg:"Something wrong happend!"});
           }
        } catch(e){
          res.status(403).json({success:false, data: null, msg: e});
        }
    },


    /* VAT */

    fetchVats : async (req,res) => {
        try{
            var vats = await Vat.find().lean();
            if(vats){
               res.status(200).json({success:true, data: vats});
            }else{
              res.status(202).json({success:false, data: null, msg:"Something wrong happend!"});
            }
        }catch(e){
            res.status(403).json({success:false, data: null, msg: e});
        }
    },

    fetchVat : async (req,res) => {
        var id = req.params.id;
        try{
            var vat = await Vat.findById({_id:id}).lean();
            if(vat){
                res.status(200).json({success:true, data: vat});
            }else{
                res.status(202).json({success:false, data: null, msg:"Something wrong happend!"});
            }
        }catch(e){
            res.status(403).json({success:false, data: null, msg: e});
        }
    },

    saveVat : async (req,res) => {
        console.log("new vat");
        console.log(req);
        
        try{
           var ins = await Vat.create(req.body);
           if(ins){
             res.status(200).json({success:true, data: ins});
           }else{
             res.status(202).json({success:false, data: null, msg:"Something wrong happend!"});
           }
        }catch(e){
            res.status(403).json({success:false, data: null, msg: e});
        }
    },

    updateVat : async (req,res) => {
        console.log("vat updates");
        console.log(req.body);
        
        var id = req.params.id;
        try{
            var ins = await Vat.findByIdAndUpdate({_id: id},req.body);
            if(ins){
              res.status(200).json({success:true, data: ins});
            }else{
              res.status(202).json({success:false, data: null, msg:"Something wrong happend!"});
            }
         }catch(e){
             res.status(403).json({success:false, data: null, msg: e});
         }
    },

    deleteVat : async(req,res) => {
        var id = req.params.id;
        try{
           var ins = await Vat.deleteOne({_id: id}).exec();
           if(ins){
             res.status(200).json({success:true, data: ins});
           }else{
             res.status(202).json({success:false, data: null, msg:"Something wrong happend!"});
           }
        } catch(e){
          res.status(403).json({success:false, data: null, msg: e});
        }
    },

    setupVat : async(req,res) => {
        try{
           data = [
              {rate:23, description: "VAT Rate", status:1},
              {rate:12, description: "VAT Rate", status:1},
           ]
           var ins = await Vat.insertMany(data);
           if(ins){
             res.status(200).json({success:true, data: ins});
           }else{
             res.status(202).json({success:false, data: null, msg:"Something wrong happend!"});
           }
        } catch(e){
          res.status(403).json({success:false, data: null, msg: e });
        }
    },

    fetchRestocks : async (req,res) => {
      try{
          var stocks = await Restock.find().populate('product').sort({_id:-1}).lean();
          if(stocks){
             stocks = stocks.map((stock) => {
                  stock.created_at = moment(stock.created_at).format('LLL');
                  return stock;
              })
              res.status(200).json({success:true, data: stocks});
          }else{
              res.status(202).json({success:false, data: null, msg:"Something wrong happend!"});
          }
      }catch(e){
          res.status(403).json({success:false, data: null, msg: e});
      }
  },

  fetchRestock : async (req,res) => {
      var id = req.params.id;
      try{
          var product = await Restock.findById({_id:id}).populate('product').lean();
          if(product){
              product.created_at = moment(product.created_at).format('LLL');
              res.status(200).json({success:true, data: product});
          }else{
              res.status(202).json({success:false, data: null, msg:"Something wrong happend!"});
          }
      }catch(e){
          res.status(403).json({success:false, data: null, msg: e});
      }
  },

  saveRestock : async (req,res) => {
      console.log(req.body);
      try{
         req.body.created_at = moment(new Date())
         var ins = await Restock.create(req.body);
         if(ins){
           res.status(200).json({success:true, data: ins});
         }else{
           res.status(403).json({success:false, data: null, msg:"Something wrong happend!"});
         }
      }catch(e){
          res.status(403).json({success:false, data: null, msg: e});
      }
  },

  updateRestock : async (req,res) => {
      var id = req.params.id;
      console.log(req.body);
      try{
          var ins = await Restock.findByIdAndUpdate({_id: id},req.body);
          if(ins){
            res.status(200).json({success:true, data: ins});
          }else{
            res.status(403).json({success:false, data: null, msg:"Something wrong happend!"});
          }
       }catch(e){
           res.status(403).json({success:false, data: null, msg: e});
       }
  },

  deleteRestock : async(req,res) => {
      var id = req.params.id;
      try{
         var ins = await Product.deleteOne({_id: id}).exec();
         if(ins){
           res.status(200).json({success:true, data: ins});
         }else{
           res.status(403).json({success:false, data: null, msg:"Something wrong happend!"});
         }
      } catch(e){
        res.status(403).json({success:false, data: null, msg: e});
      }
  },


  loadRestock : async(req,res) => {
      var id = req.params.id;
      try{
        var stock = await Restock.findOne({_id:id}).lean();
        if(stock){
            var product = await Product.findOne({_id:stock.product}).lean();
            var qty = product.quantity + stock.quantity;
            /*var data = {quantity:qty, price:stock.price, cprice: stock.cprice}*/
            var data = {quantity:qty}
            var ins = await Product.findByIdAndUpdate({_id: product._id},data);
            if(ins){
              var ins = await Restock.findByIdAndUpdate({_id: stock._id},{action:1});
              res.status(200).json({success:true, data: ins});
            }else{
              res.status(202).json({success:true, data: null, msg:"Something wrong happend!"});
            }
          }else{
              res.status(202).json({success:true, data: null, msg:"Something wrong happend!"});
          }
      } catch(e){
        res.status(403).json({success:false, data: null, msg: e});
      }
  },




}