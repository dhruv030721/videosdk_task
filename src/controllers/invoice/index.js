const createInvoice = require('./createInvoice.controller')
const updateInvoice = require('./updateInvoice.controller')
const deleteInvoice = require('./deleteInvoice.controller')
const getInvoice = require('./getInvoice.controller')
const getAllInvoice = require('./getAllInvoice.controller')
const updatePaymentStatus = require('./updatePaymentStatus.controller')
const generatePdfInvoice = require('./generatePdfInvoice.controller')

module.exports = { createInvoice, updateInvoice, deleteInvoice, getInvoice, getAllInvoice, updatePaymentStatus, generatePdfInvoice };