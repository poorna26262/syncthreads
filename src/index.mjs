const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const app = express();
app.use(cors());
app.use(express.json());

const users = [
  { username: "admin", password: bcrypt.hashSync("admin123", 8) }
];
const secret = "mySecretKey";

function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "User not logged in" });
  jwt.verify(token, secret, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = decoded;
    next();
  });
}

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const token = jwt.sign({ username }, secret, { expiresIn: "1h" });
  res.json({ token });
});

app.get("/api/dashboard", verifyToken, (req, res) => {
  res.json([
    { id: 1, title: "Card 1" },
    { id: 2, title: "Card 2" },
  ]);
});

app.get("/api/map", verifyToken, (req, res) => {
  res.json({ center: [20.5937, 78.9629], zoom: 5 });
});

app.listen(5000, () => console.log("Server running on port 5000"));
