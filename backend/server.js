const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const MONGO_URI = "mongodb+srv://Adi:Adijobdb@jspringjobapp.xiaw1.mongodb.net/?retryWrites=true&w=majority&appName=JSpringJobApp";
const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("MongoDB connection error:", err));

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  document: String, // Storing file path or URL
});
const User = mongoose.model('User', UserSchema);

app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashedPassword, document: 'sample.pdf' });
  await user.save();
  res.json({ message: 'User registered' });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ username }, 'secret', { expiresIn: '1h' });
    res.json({ token, document: user.document });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

app.get('/download', (req, res) => {
  res.download(path.join(__dirname, 'uploads/sample.pdf'));
});

app.listen(5500,'0.0.0.0', () => console.log('Server running on port 5500'));