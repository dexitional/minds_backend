var express = require('express');
const session = require('express-session');
//const store = require('connect-mongo');
var cors = require('cors');
var compression = require('compression');
var bodyParser = require('body-parser');
const socket = require('socket.io');

// Routes & Controllers
var mainRoute = require('./route/app');
var productController = require('./controller/productController');

var app = new express();
app.use(session({
  secret: 'minds', 
  resave: true,
  cookie: { 
    maxAge: 30*60*1000 
  }
}));

app.use(cors());
app.use(compression());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
/*
app.use(session({
  secret: 'SECRET KEY',
  resave: false,
  saveUninitialized: true,
  store: store.create({
      mongoUrl: 'mongodb://localhost/session-minds',
      ttl: 14 * 24 * 60 * 60,
      autoRemove: 'native' 
  })
}))
*/

app.use(mainRoute);


app.get('/', (req,res) => {
    if (!req.session.views)  req.session.views = 1;
    req.session.views++;
    res.send(`${req.session.views} views , user: ${req.session.user}`);
});

const PORT = 5016;
var server = app.listen(PORT, () => {
    console.log("Server started on Port : "+PORT);
});



// Socket IO
/**/
const io = socket(server,{
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

//const io = socket(server);

var conn = [];

io.on("connection", function (socket) {

   console.log("connected to socket.io")
   //socket.userId = data.user;
  
   
   socket.on('LOAD_PRODUCTS', async () => {
     console.log('loading products')
      const products = await productController.fetchAsyncProducts();
      console.log(products); 
      //socket.broadcastio.emit('RECEIVE_PRODUCTS', products);
      io.emit('RECEIVE_PRODUCTS', products);
   })

   /*
   socket.on('loadMessage', async () => {
       var messages = await Chat.find({room:''}).lean();
       for(var i = 0; i < messages.length; i++){
          messages[i].time = moment(messages[i].time).fromNow();
       }  console.log(messages)
       socket.emit('renderMessage',messages)
   })

   socket.on('sendMessage',async (data ) => {
       const {user, msg} = data;
       const time = moment();
       var ins = await Chat.create({username:user,message:msg,time})
       io.emit('receiveMessage', {time: time.format('LT'), username:user,msg})
   })

   socket.on("disconnect", () => {
        users = users.filter(m => m !== socket.userId);
        io.emit("user disconnected", socket.userId);
   });
   */   
});
