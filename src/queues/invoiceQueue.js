// queues/invoiceQueue.js
const Queue = require('bull');
const generatePdf = require('../utils/generatePdf');
const MailSender = require('../config/mailer');

let invoiceQueue = null;

// Single initialization function
const getQueue = () => {
    if (!invoiceQueue) {
        console.log('Initializing Redis with host:', process.env.REDIS_HOST);

        invoiceQueue = new Queue('invoice-events', {
            redis: {
                host: process.env.REDIS_HOST || 'localhost',
                port: process.env.REDIS_PORT || 6379
            }
        });
    }
    return invoiceQueue;
};

// Event handlers object
const eventHandlers = {
    'invoice.created': async (invoiceData) => {
        try {
            await logEvent('invoice.created', invoiceData);
            const pdfBuffer = await generatePdf(invoiceData);
            await MailSender({ toMail: invoiceData.customer.email, invoiceData, pdfBuffer });
        } catch (error) {
            console.log(error);
        }
    },

    'invoice.updated': async (invoiceData) => {
        try {
            await logEvent('invoice.updated', invoiceData);
            const pdfBuffer = await generatePdf(invoiceData);
            await MailSender({
                toMail: invoiceData.customer.email,
                invoiceData,
                pdfBuffer,
                title: `Your Updated Invoice ${invoiceData.invoiceNumber}`
            });
        } catch (error) {
            console.log(error);
        }
    },
};

const logEvent = async (event, data) => {
    console.log('Event Logged:', {
        event,
        data,
        timestamp: new Date().toISOString()
    });
};

const createEventHandler = (handler) => {
    return async (data) => {
        try {
            await handler(data);
        } catch (error) {
            console.error('Error processing event:', error);
            throw error;
        }
    };
};

const wrappedHandlers = Object.keys(eventHandlers).reduce((acc, key) => {
    acc[key] = createEventHandler(eventHandlers[key]);
    return acc;
}, {});

const EventQueue = () => {
    const queue = getQueue();
    const redisClient = queue.client;

    // Redis connection logging
    redisClient.on('connect', () => {
        console.log('Redis connected successfully!', {
            host: process.env.REDIS_HOST || '37.27.81.8',
            port: process.env.REDIS_PORT || 6379,
            timestamp: new Date().toISOString()
        });
    });

    redisClient.on('ready', () => {
        console.log('Redis is ready to handle requests!');
    });

    redisClient.on('error', (error) => {
        console.error('Redis connection error:', error);
    });

    redisClient.on('reconnecting', () => {
        console.log('Attempting to reconnect to Redis...');
    });

    // Process queue events
    queue.process(async (job) => {
        const { event, data } = job.data;
        const handler = wrappedHandlers[event];

        if (!handler) {
            throw new Error(`No handler found for event: ${event}`);
        }

        await handler(data);
    });

    // Queue event listeners
    queue.on('error', (error) => {
        console.error('Queue error:', error);
    });

    queue.on('failed', (job, error) => {
        console.error('Job failed:', {
            jobId: job.id,
            event: job.data.event,
            error: error.message
        });
    });

    queue.on('completed', (job) => {
        console.log('Job completed:', {
            jobId: job.id,
            event: job.data.event
        });
    });
};

const addToQueue = async (event, data) => {
    const queue = getQueue();
    return await queue.add({ event, data }, {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 2000
        }
    });
};

module.exports = {
    getQueue,
    addToQueue,
    EventQueue
};