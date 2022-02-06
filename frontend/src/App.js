import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import React, { useState, useEffect } from "react";
import {Button, Input, InputGroup} from 'reactstrap'
import Cookies from 'js-cookie';
import { ReactDOM } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  useLocation, Routes, HashRouter
} from "react-router-dom";

var key = ""

function getAuth() {
  window.location.href = "https://accounts.spotify.com/authorize?client_id=a044f0501b10491197633ffc4125a9e6&response_type=token&redirect_uri=http://localhost:3000/callback"
}

function AuthCallback(){
  let location = useLocation()
  const params = new URLSearchParams(location.hash);
  console.log(JSON.stringify(...params.entries()))
  Cookies.set("vibe_check_auth", [...params.entries()][0][1], {expires: 3600, sameSite: 'Lax'})
  window.location.href="/"
  return null
}

class CheckLogin extends React.Component {
  render() {
    console.log(Cookies.get("vibe_check_auth"))
    if(Cookies.get("vibe_check_auth") === undefined){
      return <Button color="primary" onClick={getAuth}>Log In</Button>
    }
    return <div><SongInput action={this.props.action}/></div>
  }  
}

var imageRef = React.createRef()
var vibeRef = React.createRef()
var appStyle = {}
class VibeLabel extends React.Component{
  state = {
    vibe: ""
  }
  constructor(props){
    super(props)
    this.vibeHandler = this.vibeHandler.bind(this)
  }

  vibeHandler(the_vibe){
    this.setState({vibe: the_vibe})
  }

  render(){
    return(
    <div>
      {this.state.vibe}      
    </div>
    )
  }
}
class SongInput extends React.Component {
  state = {
    song_name: "",
    artist_name: ""
  };

  handleArtistChange = event => {
    this.setState({artist_name: event.target.value})
  };
  handleSongChange = event => {
    this.setState({song_name: event.target.value})
  };

  constructor(props){
    super(props);    
  };

  get_sentiment = () => {
    axios.get("/gad", 
    {
      params:{"artist_name": this.state.artist_name, "song_name": this.state.song_name}, 
      headers: {"Authorization": "Bearer " + Cookies.get("vibe_check_auth"), "Content-Type": "application/json"} 
    })
    .then(resp => {
      let data = resp.data;//JSON.parse(resp.data);
      
      console.log(data)
      if (data["error"] !== undefined && data.error.status === 401){
          getAuth()
      } else {
        imageRef.current.src = resp.data["image"]        
        vibeRef.current.vibeHandler(resp.data["song"]+ " by " + resp.data["artist"] + " has a " + resp.data["vibe"] + " vibe.")
      }
    });
  }

  render() {
      return(
      <div id="search">
        <InputGroup onSubmit={this.get_sentiment}>
          <Input onChange={this.handleSongChange} id="songname" placeholder='Song name'/>
          <Input onChange={this.handleArtistChange} id="artistname" placeholder='Artist name'/>
          <Button color="primary" onClick={this.get_sentiment}>
            Search
          </Button>
        </InputGroup>
      </div>
      );
  }
}
class AppLogo extends React.Component {
  render(){
    return <div key={key}><img  src={logo} ref={imageRef} className="App-logo" alt="logo" /></div>
  }
}


class App extends React.Component {  
  constructor(props){
    super(props)
    this.handler = this.handler.bind(this);
    this.state = {
      style: {},
      source: ""
    }
  }

  handler(){
    console.log("Hello from app")
    this.setState(
      {
        style: 
        {"background-image": "url(" + imageRef.current.src + ")", 
        "background-repeat": "no-repeat", 
        "background-size": "cover",
        "height" : "100%",
        "filter": "blur(10px)"},
        source: imageRef.current.src
      },        
    );
    
  }

  update_style = (style) => {
    this.state.style = style
  }

  render() {
    return(
    <div className="App">
      <div className="background"><img style={this.state.style}/></div>
      <header ref={appRef => this.app = appRef} className="App-header" style={{"z-index": "-50"}}>        
        <AppLogo/>
        <div id="search" >
        </div>
        <Router>
        <Routes>
          <Route exact path="/callback" element={<AuthCallback/>}/>
        </Routes>
        </Router>
        <CheckLogin action={this.handler}/>
        <VibeLabel ref={vibeRef}/>
      </header>
    </div>
    )
  }
}

export default App;
