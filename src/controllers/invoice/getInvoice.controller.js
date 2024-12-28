const Invoice = require('../../models/invoice')

const getInvoice = async(req, res) => {
    try {

        const {id} = req.params;

        if(!id){
            return res.status(400).json({
                success: false,
                message: "Invoice ID is required to delete the invoice"
            })
        }

        const invoice = await Invoice.findOne({invoiceNumber: id});

        if(!invoice){
            return res.status(404).json({
                success: false,
                message: "Invoice not found!"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Invoice data fetched successfully!",
            data: invoice
        })
        
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!"
        })
    }
}

module.exports = getInvoice;