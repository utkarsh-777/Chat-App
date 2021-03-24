import React from "react"
import { useState,useContext } from "react"
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import {Container, Button, Checkbox, Form } from 'semantic-ui-react';
import axios from "axios";

import Context from "../context/context";
import { USER } from "../context/action.types";

const Login = () => {
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [flag,setFlag] = useState(false);
    const history = useHistory();

    const {dispatch} = useContext(Context);

    const handleSubmit = () => {
        fetch(`http://localhost:7000/api/login`,{
            method:'POST',
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                email,
                password
            })
        }).then(res=>res.json())
          .then(data=>{
              localStorage.setItem('token',data.token);
              axios(`http://localhost:7000/api/get-user`,{
                method:"GET",
                headers:{
                  Authorization:data.token
                }
              }).then(res=>{
                if(res.data){
                dispatch({type:USER,payload:res.data});
                }
              })
              history.push('/')
          }).catch(err=>{
              console.log(err)
          })
    }

    return(
        <Container style={{marginTop:"40px"}}>
        <Form onSubmit={()=>handleSubmit()}>
            <h1>Login To Chat-App</h1>
            <Form.Field>
            <label>Email</label>
            <input placeholder='Choose a Username' onChange={(e)=>setEmail(e.target.value)} />
            </Form.Field>
            <Form.Field>
            <label>Password</label>
            <input placeholder='Choose a Password' type='password' onChange={(e)=>setPassword(e.target.value)} />
            </Form.Field>
            <Form.Field>
            <Checkbox onChange={()=>setFlag(!flag)} label='I agree to the Terms and Conditions' />
            </Form.Field>
            {flag ? 
                <Button type='submit'>Login</Button>
                :
                <Button disabled type='submit'>Login</Button>
            }
        </Form>
        <p style={{marginTop:"25px"}}>Do not have an account? <Link to="/signup">Signup</Link></p>
        </Container>
    )
}

export default Login;