const express = require('express')
const cors = require('cors')
const app= express()
const authroute= require('./routes/authroutes')

const db = require('./config/db'); // path to your db.js
db()
const PORT = 5000 || process.env.PORT;
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
app.use(express.json());
app.use('/api', authroute);

app.get('/', (req, res) => {
  res.send('🚀 Hello from Express backend!');
});
app.listen(PORT)