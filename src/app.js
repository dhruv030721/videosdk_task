const express = require('express');
const dotenv = require('dotenv');
const dbConnect = require('./config/database')
const { EventQueue } = require('./queues/invoiceQueue')
const morgan = require('morgan')
const app = express();

// Load all environment variables
dotenv.config();

// Middleware 
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

// Routes
app.use('/api/auth/', require('./routes/auth.routes'))
app.use('/api/invoices/', require('./routes/invoice.routes'));

// Database Connection
dbConnect();

// Redis Connection
EventQueue();

// Server Intialization
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}!`);
})


app.get('/', (req, res) => {
    return res.send("Invoice Generator Backend is Running!")
})