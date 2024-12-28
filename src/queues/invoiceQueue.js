const Queue = require('bull')

const invoiceQueue = new Queue('invoice-events', {
    redis: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
})

const eventHandlers = {
    'invoice.created': async (invoice) => {
        await handleInvoiceCreated(invoice);
    },
    'invoice.updated': async (invoice) => {
        await handleInvoiceUpdated(invoice);
    },
    'invoice.deleted': async (invoiceId) => {
        await handleInvoiceDeleted(invoiceId);
    }
};


invoiceQueue.process(async (job) => {
    const { event, data } = job.data;

    const handleEvent = async (event, data) => {
        const handler = eventHandlers[event];
        if (handler) {
            await handler(data);
        } else {
            console.error(`No handler found for event: ${event}`);
        }
    };
})


// Error handling
invoiceQueue.on('error', (error) => {
    console.error('Queue error:', error);
});

invoiceQueue.on('failed', (job, error) => {
    console.error('Job failed:', job.id, error);
});

module.exports = invoiceQueue;