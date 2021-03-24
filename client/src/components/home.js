import React, { useContext, useEffect, useState } from "react";
import Context from "../context/context";
import {Link} from "react-router-dom";

import {
    Grid,
    Container,
    Form,
    Input,
    Button,
    Card,
    Icon
} from "semantic-ui-react"

const Home = () => {
    const {state} = useContext(Context);

    const [room,setRoom] = useState('');
    const [rooms,setRooms] = useState([]);

    const [droom,setDroom] = useState('');

    const description = [
        'Here, you can create a room and invite your friends!',
        'Or you can join a existing room and have fun!',
      ].join(' ')
    const head = `welcome, ${state && state.name}`

    useEffect(()=>{
        fetch('/api/get-all-rooms',{
            method:"GET",
            headers:{
                Authorization:localStorage.getItem('token')
            }
        }).then(res=>res.json())
        .then(resu=>{
            const arr = [];
            resu.map(item=>(
                arr.push({key:item,text:item,value:item})
            ))
            setRooms(arr);
        })
    },[])

    const handleCreateRoom = () => {
        if(room){
            fetch('/api/create-room',{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                    Authorization:localStorage.getItem('token')
                },
                body:JSON.stringify({
                    room
                })
            }).then(res=>res.json())
            .then(resu=>{
                if(resu.error){
                    return 0;
                }
            })
        }
    }
    return(
        <Container>
            <h2>Chat Home</h2>
            <Grid divided="vertically">
                <Grid.Row columns={1}>
                    <Grid.Column>
                        <Card link style={{width:'100%',marginTop:"10px"}}>
                            <Card.Content header={head} />
                            <Card.Content description={description} />
                            <Card.Content extra>
                            <Icon name='user' />{rooms && rooms.length} Rooms Created
                            </Card.Content>
                        </Card>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={2}>
                    <Grid.Column>
                        <Form>
                            <h3>Create a new Room!</h3>
                            <Form.Field>
                                <Input type="text" required value={room} placeholder="Room name" onChange={e=>setRoom(e.target.value)} />
                            </Form.Field>
                            <Link to={`/chat?room=${room}`}><Button type="submit" onClick={()=>handleCreateRoom()}>Create</Button></Link>
                        </Form>
                    </Grid.Column>
                    <Grid.Column>
                        <Form>
                            <h3>Join an existing Room!</h3>
                            <Form.Field>
                                <select onChange={e=>setDroom(e.target.value)}>
                                    <option selected value="">-</option>
                                    {rooms && rooms.map(item=>(
                                        <option value={item.key}>{item.key}</option>
                                    ))}
                                </select>
                            </Form.Field>
                            <Link to={`/chat?room=${droom}`}><Button>Join</Button></Link>
                        </Form>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Container>
    )
}

export default Home;