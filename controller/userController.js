var db = require('../config/database');
var User = require('../model/user');
var Customer = require('../model/customer');
var bcrypt = require('bcrypt');
var moment = require('moment');
var jwt = require('jsonwebtoken');
var util = require('../util/logutil');


module.exports = {

    fetchUsers : async (req,res) => {
        try{
            var users = await User.find().populate('Vat').lean();
            if(users){
                users = users.map((user) => {
                    user.created_at = moment(user.created_at).format('LLL');
                    return user;
                })
                res.status(200).json({success:true, data: users});
            }else{
                res.status(402).json({success:false, data: null, msg:"Something wrong happend!"});
            }
        }catch(e){
            res.status(402).json({success:false, data: null, msg: e});
        }
    },

    fetchUser : async (req,res) => {
        var id = req.params.id;
        try{
            var user = await User.findById({_id:id}).populate('Vat').lean();
            if(user){
                user.created_at = moment(user.created_at).format('LLL');
                res.status(200).json({success:true, data: user});
            }else{
                res.status(402).json({success:false, data: null, msg:"Something wrong happend!"});
            }
        }catch(e){
            res.status(402).json({success:false, data: null, msg: e});
        }
    },

    saveUser : async (req,res) => {
        try{
           req.body.password = bcrypt.hashSync(req.body.password,10);
           var ins = await User.create(req.body);
            console.log(ins);
           if(ins){
             util.logwriter('USER_CREATED',req.session.user.username,ins) //LOG WRITER
             res.status(200).json({success:true, data: ins});
           }else{
             res.status(204).json({success:false, data: null, msg:"Something wrong happend!"});
           }
        }catch(e){
            console.log(e)
            res.status(404).json({success:false, data: null, msg: e });
        }
    },

    updateUser : async (req,res) => {
        var id = req.params.id;
        console.log(req.session);
        try{
            var ins = await User.findByIdAndUpdate({_id: id},req.body);
            if(ins){
              console.log(req.session.user);
              util.logwriter('USER_UPDATED',req.session.user.username,ins) //LOG WRITER
              res.status(200).json({success:true, data: ins});
            }else{
              res.status(204).json({success:false, data: null, msg:"Something wrong happend!"});
            }
         }catch(e){
           console.log(e)
             res.status(404).json({success:false, data: null, msg: e});
         }
    },

    deleteUser : async(req,res) => {
        var id = req.params.id;
        try{
           var ins = await User.deleteOne({_id: id}).exec();
           if(ins){
             util.logwriter('USER_DELETED',req.session.user.username,ins) //LOG WRITER
             res.status(200).json({success:true, data: ins});
           }else{
             res.status(402).json({success:false, data: null, msg:"Something wrong happend!"});
           }
        } catch(e){
          res.status(402).json({success:false, data: null, msg: e});
        }
    },

    setupUser : async(req,res) => {
        try{
            data = [
                {name:"Software Developer", phone: "0277675089", email: "ebenezerkb.ackah@gmail.com", username: "dexitional", password:bcrypt.hashSync('gloria007',10), location: "Akotokyir", address: "MIS-UCC", allow_access: 1},
                {name:"Software Developer", phone: "0244087163", email: "skoku@gmail.com", username: "skoku", password:bcrypt.hashSync('p@ssw0rd1234',10), location: "Akotokyir", address: "MIS-UCC", allow_access: 1}
            ]
           var ins = await User.insertMany(data);
           if(ins){
             res.status(200).json({success:true, data: ins});
           }else{
             res.status(402).json({success:false, data: null, msg:"Something wrong happend!"});
           }
        } catch(e){
          res.status(402).json({success:false, data: null, msg: e});
        }
    },

    verifyUser : async (req,res) => {
        const { username,password } = req.body;
        console.log(req.body);
        try{
            var user = await User.findOne({username}).lean();
            const match = bcrypt.compareSync(password, user.password);
            if(password && match){
                user.created_at = moment(user.created_at).format('LLL');
                const token = jwt.sign({data:user}, 'secret', { expiresIn: 60 * 60 });
                user.token = token;
                util.logwriter('LOGIN_SUCCESS',username,{username,password:user.password}) //LOG WRITER
                req.session.user = user;
                console.log(req.session.user);
                res.status(200).json({success:true, data: user});
                
            }else{
                util.logwriter('LOGIN_FAILED',username,{ username,password }) //LOG WRITER
                res.status(403).json({success:false, data: null, msg:"Something wrong happend!"});
            }
        }catch(e){
            console.log(e)
            util.logwriter('LOGIN_FAILED',username,{ username,password }) //LOG WRITER
            res.status(403).json({success:false, data: null, msg: e});
        }
    },

    resetUser : async (req,res) => {
        var id = req.params.id;
        try{
            if(req.query.pwd && req.query.pwd != ''){
              var pwd =  bcrypt.hashSync(req.query.pwd.trim(),10);
              var ins = await User.findByIdAndUpdate({_id: id},{password:pwd});
            }
            if(ins){
              util.logwriter('USER_PASSWORD_CHANGED',req.session.user.username,ins) //LOG WRITER
              res.status(200).json({success:true, data: ins});
            }else{
              res.status(204).json({success:false, data: null, msg:"Something wrong happend!"});
            }
         }catch(e){
             res.status(404).json({success:false, data: null, msg: e});
         }
    },

    fetchClients : async (req,res) => {
        try{
            var users = await Customer.find().sort({_id:-1 }).lean();
            if(users){
                users = users.map((user) => {
                    user.created_at = moment(user.created_at).format('LLL');
                    return user;
                })
                res.status(200).json({success:true, data: users});
            }else{
                res.status(402).json({success:false, data: null, msg:"Something wrong happend!"});
            }
        }catch(e){
            res.status(402).json({success:false, data: null, msg: e});
        }
    },

    fetchClient : async (req,res) => {
        var id = req.params.id;
        try{
            var user = await Customer.findById({_id:id}).lean();
            if(user){
                user.created_at = moment(user.created_at).format('LLL');
                res.status(200).json({success:true, data: user});
            }else{
                res.status(402).json({success:false, data: null, msg:"Something wrong happend!"});
            }
        }catch(e){
            res.status(402).json({success:false, data: null, msg: e});
        }
    },

    saveClient : async (req,res) => {
      console.log(req.body);
        try{
          var ins = await Customer.create(req.body);
          console.log(ins);
          if(ins){
            util.logwriter('CUSTOMER_CREATED',req.session.user.username,ins) //LOG WRITER
            res.status(200).json({success:true, data: ins});
          }else{
            res.status(204).json({success:false, data: null, msg:"Something wrong happend!"});
          }
        }catch(e){
            console.log(e)
            res.status(404).json({success:false, data: null, msg: e });
        }
    },

    updateClient : async (req,res) => {
        var id = req.params.id;
        try{
            var ins = await Customer.findByIdAndUpdate({_id: id},req.body);
            if(ins){
              util.logwriter('CUSTOMER_UPDATED',req.session.user.username,ins) //LOG WRITER
              res.status(200).json({success:true, data: ins});
            }else{
              res.status(204).json({success:false, data: null, msg:"Something wrong happend!"});
            }
        }catch(e){
            res.status(404).json({success:false, data: null, msg: e});
        }
    },

    deleteClient : async(req,res) => {
        var id = req.params.id;
        try{
          var ins = await Customer.deleteOne({_id: id}).exec();
          if(ins){
            util.logwriter('CUSTOMER_DELETED',req.session.user.username,ins) //LOG WRITER
            res.status(200).json({success:true, data: ins});
          }else{
            res.status(402).json({success:false, data: null, msg:"Something wrong happend!"});
          }
        } catch(e){
          res.status(402).json({success:false, data: null, msg: e});
        }
    },

  }