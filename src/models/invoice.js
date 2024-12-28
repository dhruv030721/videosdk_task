const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
    invoiceNumber: {
        type : String,
        required: true,
        unique: true
    },
    customer: {
        name : {
            type: String,
            required: true
        },
        address: String,
        email : String,
        phone: String
    },
    items: [{
        name: {type: String, required: true},
        quantity: {type: Number, required: true},
        unitPrice: {type: Number, required: true}
    }],
    taxRate: {type: Number, default: 0},
    discount : {type: Number, default: 0},
    totalAmount: {type: Number, required: true},
    paymentStatus: {
        type: String,
        enum : ['pending', 'paid', 'overdue'],
        default: 'pending'
    },
    invoiceDate: {type: Date, default: Date.now},
    dueDate: {type: Date, required: true},
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
})


module.exports = mongoose.model('Invoice', InvoiceSchema);

