const express = require('express');
const dotenv = require('dotenv');
const dbConnect = require('./config/database')
const app = express();

// Load all environment variables
dotenv.config();

// Middleware 
app.use(express.json());

// Routes
app.use('/api/auth/', require('./routes/auth.routes'))
app.use('/api/invoices/', require('./routes/invoice.routes'));

// Database Connection
dbConnect();

// Server Intialization
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}!`);
})