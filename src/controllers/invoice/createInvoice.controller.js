const { default: mongoose } = require('mongoose');
const Invoice = require('../../models/invoice')
const { validDate } = require('../../utils/dateValidation');
const { generateInvoiceNumber } = require('../../utils/generateInvoiceNumber');
const { validMongodoId } = require('../../utils/mongoIdValidation');
const invoiceEmitter = require('../../events/invoiceEvents')


const createInvoice = async (req, res) => {
    try {

        const { customer, items, taxRate, discount, dueDate, createdBy } = req.body;

        if (!customer || !items || !taxRate || !discount || !dueDate || !createdBy) {
            return res.status(403).json({
                success: false,
                message: "Validation Error! Kindly request to checkout details."
            })
        }

        // Validation of dueDate
        if (!validDate(dueDate)) {
            return res.status(403).json({
                success: false,
                message: "Please enter valid dueDate."
            })
        }

        // Generate Invoice Number
        const invoiceNumber = generateInvoiceNumber();

        // Calculate Total Amount
        let totalAmount = items.reduce((sum, element) => {
            let elementTotalPrice = element.quantity * element.unitPrice;
            return sum + elementTotalPrice;
        }, 0);

        // Apply tax (Tax is added)
        if (taxRate) {
            totalAmount += (totalAmount * taxRate) / 100;
        }

        // Apply discount (Discount is subtracted)
        if (discount) {
            totalAmount -= (totalAmount * discount) / 100;
        }


        // Convert into MongoID
        if (!validMongodoId(createdBy)) {
            return res.status(403).json({
                success: false,
                message: "Invalid 'createdBy' ID."
            });
        }

        const createdById = mongoose.Types.ObjectId.isValid(createdBy)
            ? new mongoose.Types.ObjectId(createdBy)
            : null;

        // Creating Invoice
        const invoice = await Invoice.create({
            invoiceNumber,
            customer,
            items,
            taxRate,
            discount,
            dueDate,
            totalAmount,
            createdBy: createdById
        })

        if (invoice) {

            // Emit event for creation of invoice
            invoiceEmitter.emit('invoice.created', invoice);

            return res.status(201).json({
                success: true,
                message: "Invoice created successfully!"
            })
        } else {
            return res.status(400).json({
                success: false,
                message: "Something wrong while creating invoice, Try again later!"
            })
        }


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!"
        })
    }
}


module.exports = createInvoice;