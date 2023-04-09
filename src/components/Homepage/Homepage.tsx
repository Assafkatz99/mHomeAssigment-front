import { Box, Container, Paper, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TypingAnimation from "../TypingAnimation/TypingAnimation";

const paper_sx = {
  width:"clamp(150px,20vw,20vw)",
  height:"clamp(150px,20vw,20vw)",
  mx:1,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  fontWeight:"bold",
  color:"white",
  bgcolor:"rgb(236, 172, 172)",
  fontSize:"35px",

  ":hover":{cursor:"pointer", transition:"0.2s", scale:"1.01"}
}


const Homepage: React.FC = () => {
  const navigate = useNavigate();
  const [roomsData,setRoomsData] = useState([])
  const [isLoading, setIsLoading] = useState(false);

  const handleNavigateToRoom = (roomId: string) => {
    navigate(`/CodeRoom/${roomId}`);
  };

  const fetchApiData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        // "http://localhost:8000/api/",
        "https://mhomeassigment-back.onrender.com/api/",
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const rooms = response.data.rooms;
      setRoomsData(rooms);
      sessionStorage.setItem("roomsData", JSON.stringify(rooms));
    } catch (error: any) {
      alert(error.response.data);
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    fetchApiData();
  }, []);

  return (<Box sx={{ backgroundImage: "url('/assets/bg/bg.png')",
  backgroundSize: "cover",
  backgroundPosition: "center", }}>
    <Container sx={{ display: "flex", flexDirection: "column", alignItems: "center", minHeight: "100vh", py: 3, gap: "70px" }}>
      {isLoading && <div>Loading...</div>}

      <Box sx={{ borderRadius: "20px" }}><img style={{height: "auto", width: "400px"}} src="/assets/logo/logo.png"/></Box>
      <Box sx={{fontWeight:"bold", color:"rgb(114, 113, 113)", height: "70px", width: "400px",display:"center", justifyContent:"center", textAlign:"center",fontSize:"20px" }}> Meet E'FTA ROOMS, your new and best way to       <TypingAnimation words={["CREATE", "COLLABORATE","LEARN",  "SHARE", "TEACH",  "DREAM",  "ACHIEVE"]}  />
</Box>

      <Box sx={{ height: "fit-content", width: "100%", display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: "20px 0px", position: "relative" }}>
        <Typography sx={{ position: "absolute", left: "0px", top: "-40px" }} variant="subtitle1">
          CHOOSE CODE BLOCK:
        </Typography>

        {roomsData.map((room) => {
  return (
            <Paper elevation={3} sx={{ ...paper_sx }} onClick={() => handleNavigateToRoom(String(room["roomId"]))}>
          {String(room["roomName"]).toUpperCase()}
        </Paper>
  )
})}





      </Box>
    </Container></Box>
  );
};

export default Homepage;
