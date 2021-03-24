const express = require('express');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 7000;
const socket = require('socket.io');
const http = require('http');
require('dotenv').config();
const bodyparser = require('body-parser');
const cors = require('cors');
const {MONGO_URI} = require('./keys');
const Room = require('./models/Room');

const app = express()
const server = http.createServer(app);

const {addUser,removeUser,getUser} = require('./users');
const authRoutes = require('./routes/authRoutes');
const roomRoutes = require("./routes/roomRoutes");

const io = socket(server,{
    cors:{
        origin:"*",
        method:["GET","POST"]
    }
})

io.on('connection',(socket)=>{

    socket.on('join',({name,room},callback)=>{
        const {error} = addUser({id:socket.id,name,room});
        if(error){
            callback(error);
        }
        socket.broadcast.to(room).emit('message',{user:'admin',msg:`${name} has joined the room!`});
        socket.emit('message',{user:'admin',msg:`Welcome, ${name} to room ${room}!`});

        socket.join(room);
    });

    socket.on('send-message',({msg},callback)=>{
        const user = getUser(socket.id);
        const name = user.name;
        io.to(user.room).emit('message',{user:name,msg:msg});
        Room.findOneAndUpdate({name:user.room},{
            $push:{messages:{user:name,msg}}
        },{new:true},(err,result)=>{
            if(err){
                return res.json({error:'Error to insert data'})
            }
            console.log(result);
        })
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
        console.log(user);
        io.to(user.room).emit('message',{user:'admin',msg:`${user.name} left the room!`})
    });
});

mongoose.connect(MONGO_URI,{
    useNewUrlParser:true,
    useUnifiedTopology:true
});

mongoose.connection.on('connected',()=>{
    console.log('DB connected!')
});

mongoose.connection.on('error',()=>{
    console.log('Error connecting to DB!')
});

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}));
app.use(cors({origin:'*',methods:["GET","POST","PUT","DELETE"]}));

app.use('/api',authRoutes);
app.use('/api',roomRoutes);

server.listen(PORT,()=>{
    console.log(`Server listening at ${PORT}`)
});
