import { useState } from "react";
import { useNavigate, Routes, Route, Link } from "react-router-dom";
import ChatPage from "./pages/chat";
import DrawPage from "./pages/draw";

function Home(){
  const navigate = useNavigate();
  return (
      <div className="container"> 
      <div className="title" >SOMEONE IS NOT HUMAN</div>
      <button className="start-button" onClick={() => navigate("chatpage")}>Start Game</button> 
    </div>
  );
}
export default function App(){  
  return (
    <>
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/chatpage" element={<ChatPage task="Write a joke about you"/>}/>
      <Route path="/drawpage" element={<DrawPage task="Draw lion with horns"/>}/>
    </Routes> 

    </>); 
}