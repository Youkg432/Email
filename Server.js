
    return res.status(200).json({ message: "Login successful", username: user.username, ip: user.ip });
  } else {
    return res.status(400).json({ error: "Invalid username or password" });
  }
});

// Route to serve chat rooms data
app.get("/rooms", (req, res) => {
  res.json({ rooms: chatRooms });
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Handle room joining
  socket.on("joinRoom", (room) => {
    socket.join(room);
    console.log(`${socket.id} joined ${room}`);
    socket.emit("message", { sender: "System", text: `You joined ${room}` });
  });

  // Listen for messages from clients
  socket.on("message", (data) => {
    // Broadcast message to the specific room
    io.to(data.room).emit("message", data);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
