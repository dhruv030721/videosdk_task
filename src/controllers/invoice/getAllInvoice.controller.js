const Invoice = require('../../models/invoice')

const getAllInvoice = async (req, res) => {
    try {

        const { page = 1, limit = 10 } = req.query;

        const invoices = await Invoice.find().skip((page - 1) * limit).limit(limit);

        if (!invoices) {
            return res.status(404).json({
                success: false,
                message: "No any Invoices found!"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Invoices data fetched successfully!",
            data: invoices
        })


    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!"
        })
    }
}

module.exports = getAllInvoice;