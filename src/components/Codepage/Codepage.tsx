import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/javascript/javascript.js";
import { Box, Container, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";

const Codepage = () => {
  const roomId = Number(useParams<{ room: string }>().room);
  const [code, setCode] = useState("");
  const [roomName, setRoomName] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  const handleUpdateCodeToServer = async (roomId: number, roomCode: string) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/updateRoom/",
        { roomId: roomId, roomCode: roomCode },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error: any) {
      alert(error.response.data);
    }

    setTimeout(() => {
      setIsSaved(false);
    }, 3000);
  };

  useEffect(() => {
    const stringData = sessionStorage.getItem("roomsData");
    if (stringData !== null) {
      const storedRoomsData = JSON.parse(stringData);
      const room = storedRoomsData[roomId - 1];
      setRoomName(room["roomName"]);
    }
  }, [roomId]);

  const socket = useMemo(
    () => io("http://localhost:8000/", { query: { roomId: roomId } }),
    [roomId]
  );

  const navigate = useNavigate();

  const [readOnly, setReadOnly] = useState(true);

  useEffect(() => {
    socket.emit("joinRoom", roomId);
    socket.on("codeUpdate", (newCode) => {
      setCode(newCode);
    });
    socket.on("readOnly", (socketReadOnly) => {
      setReadOnly(socketReadOnly);
    });

    return () => {
      socket.off("codeUpdate");
      socket.off("readOnly");
    };
  }, [socket]);

  let lastEmitTime = 0;
  const emitDelay = 500;

  const handleChange = (editor: any, data: any, value: any) => {
    setCode(value);

    const now = Date.now();
    const elapsed = now - lastEmitTime;

    if (elapsed >= emitDelay) {
      socket.emit("codeUpdate", value);
      lastEmitTime = now;
    } else {
      setTimeout(() => {
        socket.emit("codeUpdate", value);
        lastEmitTime = Date.now();
      }, emitDelay - elapsed);
    }
  };

  useEffect(() => {
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Box sx={{ backgroundImage: "url('/assets/bg/bg.png')",
  backgroundSize: "cover",
  backgroundPosition: "center", }}>
      <style>
        {`
          .CodeMirror {
            height: clamp(500px, 60vh, 800px);
          }
        `}
      </style>
      <Box
          onClick={() => {
            navigate("/");
          }}
          sx={{

            width: "40px",
            display: "flex",
            justifyContent: "center",
            fontSize: "8px",
            fontWeight: "bold",
            letterSpacing: "0.5px",
            color: "white",
            bgcolor: "rgb(151, 151, 151)",
            py: 1,
            px: 2,
position:"absolute",
left:"5px",
top:"5px",
            borderRadius: "10px",
            ":hover": { cursor: "pointer" },
            ":active": { transition: "0.2s", scale: "0.95" },
          }}>
{"<< BACK"}
        </Box>
      <Container
   sx={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minHeight: "100vh",
    py: 1,
    gap: "40px",
    backgroundImage: "url('/assets/bg/bg.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}>
        <Box
          onClick={() => {
            navigate("/");
          }}
          sx={{
            borderRadius: "20px",
            ":hover": { cursor: "pointer" },
          }}>
          <img
            style={{ height: "auto", width: "250px" }}
            src="/assets/logo/logo.png"
          />
        </Box>
        <Box
          sx={{
            fontSize: "25px",
            fontWeight: "bold",
            letterSpacing: "0.5px",
            color: "rgb(236, 172, 172)",
          }}>
          {roomName.toUpperCase()}
        </Box>
        <Box
          sx={{
            overflow: "auto",
            width: "100%",
            height: "fit-content",
            display: "flex",
            flexDirection: "column",
          }}>
          <Box
            sx={{
              height: "50px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
            <Box sx={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                {readOnly ? "Mentor" : "Student"}
              </Typography>
              {readOnly ? (
                <Box
                  sx={{
                    fontSize: "10px",
                    fontWeight: "bold",
                    letterSpacing: "0.5px",
                    bgcolor: "lightgray",
                    py: "2px",
                    px: 1,
                    borderRadius: "5px",
                  }}>
                  Read Only
                </Box>
              ) : (
                <></>
              )}
            </Box>

            <Box
              onClick={() => {
                setIsSaved(true);
                handleUpdateCodeToServer(Number(roomId), code);
              }}
              sx={{
                width: "120px",
                display: "flex",
                justifyContent: "center",
                fontSize: "10px",
                fontWeight: "bold",
                letterSpacing: "0.5px",
                color: "white",
                bgcolor: isSaved ? "rgb(121, 191, 64)" : "rgb(225, 127, 127)",
                py: 1,
                px: 2,
                borderRadius: "10px",
                ":hover": { cursor: "pointer" },
                ":active": { transition: "0.2s", scale: "0.95" },
              }}>
              {isSaved ? "Saved" : "Save to database"}
            </Box>
          </Box>

          <Box
            sx={{
              borderRadius: "5px",
              overflow: "auto",
              width: "auto",
              height: "fit-content",
            }}>
            <CodeMirror
              value={code}
              options={{
                mode: "javascript",
                theme: "material",
                lineNumbers: true,
                autoScroll: true,
                readOnly: readOnly,
              }}
              onBeforeChange={handleChange}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Codepage;
