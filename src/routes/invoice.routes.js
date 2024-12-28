const express = require('express')
const { createInvoice, updateInvoice, deleteInvoice, getInvoice, getAllInvoice, updatePaymentStatus, generatePdfInvoice } = require('../controllers/invoice/index')

const { authMiddleware, roleCheckMiddleware } = require('../middlewares/index')

const invoiceRouter = express.Router();

invoiceRouter.post('/', authMiddleware, roleCheckMiddleware(['admin']), createInvoice);
invoiceRouter.put('/:id', authMiddleware, roleCheckMiddleware(['admin']), updateInvoice);
invoiceRouter.get('/:id', authMiddleware, getInvoice);
invoiceRouter.get('/', authMiddleware, roleCheckMiddleware(['admin']), getAllInvoice);
invoiceRouter.delete('/:id', authMiddleware, roleCheckMiddleware(['admin']), deleteInvoice);
invoiceRouter.post('/updatePaymentStatus', authMiddleware, roleCheckMiddleware(['admin']), updatePaymentStatus);
invoiceRouter.post('/pdf/:invoiceNumber', authMiddleware, roleCheckMiddleware(['admin']), generatePdfInvoice);


module.exports = invoiceRouter;