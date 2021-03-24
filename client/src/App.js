import React, { useContext, useEffect, useReducer } from "react";
import {BrowserRouter as Router,Route,Switch, useHistory} from "react-router-dom";
import Chat from "./components/Chat/chat";
import Home from "./components/home";
import Signup from "./components/signup";
import 'semantic-ui-css/semantic.min.css';
import Login from "./components/login";
import Context from "./context/context";
import axios from "axios";
import { USER } from "./context/action.types";
import { reducer,initialState } from "./context/reducer";

const Routing = () => {
  const {dispatch} = useContext(Context);
  const history = useHistory();
  useEffect(()=>{
    const token = localStorage.getItem('token');
    if(token){
      axios('http://localhost:7000/api/get-user',{
        method:"GET",
        headers:{
          Authorization:token
        }
      }).then(res=>{
        if(res.data){
        return dispatch({type:USER,payload:res.data});
        }
        return history.push('/login')
      })
    }else{
      return history.push('/login')
    }
  },[dispatch,history])

  return(
    <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/chat" component={Chat} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/login" component={Login} />
    </Switch>
  )
}

const App = () =>  {
  const [state,dispatch] = useReducer(reducer,initialState)
  return (
    <Context.Provider value={{state,dispatch}}>
        <Router>
          <Routing />
        </Router>
    </Context.Provider>
  );
}

export default App;
