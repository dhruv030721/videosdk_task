const Invoice = require('../../models/invoice');
const { validDate } = require('../../utils/dateValidation');

const updateInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        const { customer, items, taxRate, discount, dueDate, updatedBy } = req.body;

        if (!id) {
            return res.status(403).json({
                success: false,
                message: "Invoice ID is required for updating.",
            });
        }

        // Check if any update data is provided
        if (!customer && !items && !taxRate && !discount && !dueDate && !updatedBy) {
            return res.status(403).json({
                success: false,
                message: "No data provided to update the invoice.",
            });
        }

        // Validate dueDate if provided
        if (dueDate && !validDate(dueDate)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid due date.",
            });
        }

        let totalAmount;

        // Recalculate the total amount if items, taxRate, or discount is updated
        if (items) {
            totalAmount = items.reduce((sum, element) => {
                let elementTotalPrice = element.quantity * element.unitPrice;
                return sum + elementTotalPrice
            }, 0);
            if (taxRate) {
                totalAmount = totalAmount - (totalAmount * taxRate) / 100;
            }
            if (discount) {
                totalAmount = totalAmount - (totalAmount * discount) / 100;
            }
        }

        const updatedInvoice = await Invoice.findOneAndUpdate(
            {invoiceNumber : id},
            {
                ...(customer && { customer }),
                ...(items && { items }),
                ...(taxRate && { taxRate }),
                ...(discount && { discount }),
                ...(dueDate && { dueDate }),
                ...(totalAmount && { totalAmount }),
                ...(updatedBy && { updatedBy }),
            },
            { new: true }
        );

        if (updatedInvoice) {
            return res.status(200).json({
                success: true,
                message: "Invoice updated successfully!",
                invoice: updatedInvoice,
            });
        } else {
            return res.status(404).json({
                success: false,
                message: "Invoice not found or could not be updated.",
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!",
        });
    }
};

module.exports = updateInvoice;
