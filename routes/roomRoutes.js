const express = require('express');
const Room = require('../models/Room');
const router = express.Router();
const requireLogin = require('../middlewares/requireLogin');

router.post("/create-room",requireLogin,(req,res)=>{
    Room.findOne({name:req.body.room})
        .then(room=>{
            if(room){
                return res.json({
                    error:"Room name taken!"
                })
            }
            const newRoom = new Room({
                name:req.body.room,
                messages:[],
                createdBy:req.user
            });

            newRoom.save()
                .then(room=>{
                    return res.json(room)
                }).catch(err=>{
                    return res.status(421).json({
                        error:err
                    })
                })
        }).catch(err=>console.log(err))
});

router.post('/room-messages',requireLogin,(req,res)=>{
    Room.findOne({name:req.body.name})
        .then(room=>{
            if(!room){
                return res.json({error:"Room not found!"})
            }
            return res.json(room.messages);
        })
})

router.get('/get-all-rooms',requireLogin,(req,res)=>{
    Room.find()
        .then(room=>{
            if(!room){
                return res.status(404).json({
                    error:"Not Found!"
                })
            }
            const arr = room.map(item=>(
                item.name
            ))
            return res.json(arr);
        })
});

module.exports = router;