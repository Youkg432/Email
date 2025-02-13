const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middleware to parse JSON and URL-encoded form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// In-memory storage for users and chat rooms
let users = [];  // Stores user details including username, password, IP, etc.
let chatRooms = ["General", "Technology", "Gaming"];  // Example chat rooms

// Serve static files (chat UI)
app.use(express.static('public'));

// Route to serve the home page (login/signup page)
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// Route to register a new user
app.post("/register", (req, res) => {
  const { username, password } = req.body;
  
  // Simple validation: check if username already exists
  if (users.some((user) => user.username === username)) {
    return res.status(400).json({ error: "Username already exists" });
  }

  // Register the new user with username, password, and IP
  const newUser = {
    username,
    password,
    ip: req.ip,  // Capture the user's IP address
  };
  
  users.push(newUser);
  res.status(200).json({ message: "User registered successfully" });
});

// Route for user login
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Check if the user exists and password matches
  const user = users.find((user) => user.username === username && user.password === password);

  if (user) {
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
