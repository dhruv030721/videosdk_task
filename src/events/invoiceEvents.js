const EventEmitter = require('events');
const MailSender = require('../config/mailer');
const generatePdf = require('../utils/generatePdf')
const invoiceEmitter = new EventEmitter()

// Logging Event for Testing 
const logEvent = async (event, data) => {
    console.log('Event Logged:', {
        event,
        data,
        timestamp: new Date().toISOString()
    });
}


// Event Handlers

// Invoice Creation Event
invoiceEmitter.on('invoice.created', async (invoiceData) => {
    try {
        await logEvent('invoice.created', invoiceData);

        const pdfBuffer = await generatePdf(invoiceData);

        // Send Mail to User 
        await MailSender({ toMail: invoiceData.customer.email, invoiceData, pdfBuffer });

    } catch (error) {
        console.log(error)
    }
    
})


// Invoice Update Event
invoiceEmitter.on('invoice.updated', async(invoiceData) => {
    try {
        await logEvent('invoice.updated', invoiceData);

        const pdfBuffer = await generatePdf(invoiceData);

        // Send Mail to User 
        await MailSender({ toMail: invoiceData.customer.email, invoiceData, pdfBuffer, title: `Your Updated Invoice ${invoiceData.invoiceNumber}` });

    } catch (error) {
        console.log(error)
    }
})


module.exports = invoiceEmitter;