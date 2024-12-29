const EventEmitter = require('events');
const { addToQueue } = require('../queues/invoiceQueue')

const invoiceEmitter = new EventEmitter();

// Register event handlers
const events = ['invoice.created', 'invoice.updated', 'invoice.deleted'];

events.forEach(event => {
    invoiceEmitter.on(event, async (data) => {
        try {
            await addToQueue(event, data);
        } catch (error) {
            console.error(`Error queueing ${event} event:`, error);
        }
    });
});

module.exports = invoiceEmitter;