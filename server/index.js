const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const todoModel = require('./Models/Todo');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = express();

const allowedOrigins = (process.env.CLIENT_URLS || '')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);
const port = process.env.PORT || 5000;


app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));


app.use(express.json());

// 3. DATABASE CONNECTION

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log("MongoDB connection error:", err));

// ROUTES
app.get("/", (req, res) => {

    res.json("Hello! Backend is running successfully.");

});

app.get('/get', (req, res) => {
  todoModel.find()
    .then(result => res.json(result))
    .catch(err => res.status(500).json(err));
});

app.post('/add', (req, res) => {
  const task = req.body.task;
  todoModel.create({ task: task })
    .then(result => res.json(result))
    .catch(err => res.status(500).json(err));
});

app.put('/update/:id', (req, res) => {
  const { id } = req.params;
  todoModel.findByIdAndUpdate(id, { task: req.body.task }, { new: true })
    .then(result => res.json(result))
    .catch(err => res.status(500).json(err));
});

app.delete('/delete/:id', (req, res) => {
  const { id } = req.params;
  todoModel.findByIdAndDelete(id)
    .then(result => res.json(result))
    .catch(err => res.status(500).json(err));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
