import React, { useState } from "react";
import {
  Box,
  Fab,
  Paper,
  Typography,
  TextField,
  IconButton,
} from "@mui/material";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Merhaba! Size nasıl yardımcı olabilirim?", isBot: true },
  ]);
  const [input, setInput] = useState("");

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim()) {
      setMessages([...messages, { text: input, isBot: false }]);
      setInput("");
      // Here you'll integrate with your AI backend later
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 20,
        right: 20,
        zIndex: 1000,
      }}
    >
      {isOpen && (
        <Paper
          elevation={3}
          sx={{
            position: "absolute",
            bottom: 80,
            right: 0,
            width: 320,
            height: 480,
            borderRadius: 3,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#fff",
          }}
        >
          {/* Chat Header */}
          <Box
            sx={{
              p: 2,
              backgroundColor: "#553C9A",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <SmartToyOutlinedIcon />
              <Typography
                variant="h6"
                sx={{ fontFamily: "'Poppins', sans-serif" }}
              >
                AI Assistant
              </Typography>
            </Box>
            <IconButton
              size="small"
              onClick={handleToggle}
              sx={{ color: "white" }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Chat Messages */}
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              p: 2,
              display: "flex",
              flexDirection: "column",
              gap: 1,
              backgroundColor: "#F6F0FE",
            }}
          >
            {messages.map((message, index) => (
              <Box
                key={index}
                sx={{
                  alignSelf: message.isBot ? "flex-start" : "flex-end",
                  maxWidth: "80%",
                }}
              >
                <Paper
                  sx={{
                    p: 1.5,
                    backgroundColor: message.isBot ? "#fff" : "#553C9A",
                    color: message.isBot ? "#4A5568" : "#fff",
                    borderRadius: message.isBot
                      ? "12px 12px 12px 0"
                      : "12px 12px 0 12px",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                  }}
                >
                  <Typography sx={{ fontFamily: "'Inter', sans-serif" }}>
                    {message.text}
                  </Typography>
                </Paper>
              </Box>
            ))}
          </Box>

          {/* Chat Input */}
          <Box
            component="form"
            onSubmit={handleSend}
            sx={{
              p: 2,
              backgroundColor: "#fff",
              borderTop: "1px solid rgba(0,0,0,0.1)",
              display: "flex",
              gap: 1,
            }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Mesajınızı yazın..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                  fontFamily: "'Inter', sans-serif",
                },
              }}
            />
            <IconButton
              type="submit"
              sx={{
                backgroundColor: "#553C9A",
                color: "white",
                "&:hover": {
                  backgroundColor: "#4A3294",
                },
              }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      )}

      {/* Chat Toggle Button */}
      <Fab
        color="primary"
        onClick={handleToggle}
        sx={{
          backgroundColor: "#553C9A",
          "&:hover": {
            backgroundColor: "#4A3294",
          },
          boxShadow: "0 4px 20px -5px rgba(107, 70, 193, 0.4)",
        }}
      >
        <SmartToyOutlinedIcon />
      </Fab>
    </Box>
  );
}

export default Chatbot;
