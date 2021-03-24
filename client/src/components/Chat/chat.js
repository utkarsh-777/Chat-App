import React,{ useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import Context from "../../context/context";
import "./chat.css"
import {
    Container,
    Input,
    Message
} from "semantic-ui-react";

const queryString = require('query-string');

let socket;

const Chat = ({location}) => {
    const ENDPOINT = "localhost:7000"
    const {state} = useContext(Context);

    const [message,setMessage] = useState('');
    const [messages,setMessages] = useState([]);

    const parsed = queryString.parse(location.search);

    useEffect(()=>{
        fetch('/api/room-messages',{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                Authorization:localStorage.getItem('token')
            },
            body:JSON.stringify({
                name:parsed.room
            })
        }).then(res=>res.json())
        .then(resu=>{
            if(resu.length>0){
            const arr = resu.map(item=>(
                {user:item.user,msg:item.msg}
            ));
            setMessages(arr);
            } 
        })
    },[parsed.room]);

    useEffect(()=>{
        if(state){
            socket = io(ENDPOINT);
            socket.emit('join',{name:state.name,room:parsed.room},({error})=>{
                if(error){
                    console.log(error);
                }
            });
            socket.on('message',({user,msg},error)=>{
                if(error){
                    console.log(error);
                }
            });
        }
    },[ENDPOINT,state,parsed.room]);

    useEffect(()=>{
        if(state){
            socket.on('message',(message)=>{
                setMessages([...messages,message])
            });
        }
    },[messages,state]);

    const sendMessage = (e) => {
        e.preventDefault();
        if(message){
            socket.emit('send-message',{msg:message})
            setMessage('')
        }
    }

    return(
        <div>
        <h2 style={{marginLeft:"5px",marginTop:"10px"}}>Chat Application</h2>
            <Container style={{height:"550px",width:"100%"}} id="cont">
                {messages && messages.map(item=>(
                    <div>
                        {state ? 
                            <div>
                                {state.name === item.user ? 
                                    <Message style={{borderRadius:"20px",width:"60%",float:"right",margin:"5px"}} header={item.msg} content={item.user} />
                                    :
                                    <Message style={{borderRadius:"20px",width:"60%",float:"left",margin:"5px"}} header={item.msg} content={item.user} />
                                }
                            </div> 
                            : 
                            null
                        }
                    </div>
                ))}
            </Container>
            <Input type="text" action={{
                color: 'teal',
                labelPosition: 'right',
                icon: 'send',
                content: 'Send',
                onClick: (e)=>sendMessage(e)
              }} id='send' value={message} fluid style={{marginTop:"5px"}} placeholder="Send Message.." onKeyPress={(e)=> e.key==="Enter" ? sendMessage(e) : null} onChange={(e)=>setMessage(e.target.value)} />
        </div>
    )
}

export default Chat;