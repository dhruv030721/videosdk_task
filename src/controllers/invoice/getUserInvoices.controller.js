const Invoice = require('../../models/invoice')


const getUserInvoices = async (req, res) => {
    try {

        const { email } = req.params;

        if (!email) {
            return res.status(403).json({
                success: false,
                message: "Validation Error!"
            })
        }

        // Compare token data with actual data 
        if (req.user.email != email) {
            return res.status(400).json({
                success: false,
                message: "User not verified!"
            })
        }

        const invoices = await Invoice.find({ "customer.email": email });

        if (invoices) {
            return res.status(200).json({
                success: true,
                message: "User invoices fetched successfully!",
                data: invoices
            })
        }

        return res.status(400).json({
            success: false,
            message: "Something is wrong while fetching invoices data, Try again later!"
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!"
        })
    }
}

module.exports = getUserInvoices;