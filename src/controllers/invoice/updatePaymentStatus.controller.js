const Invoice = require('../../models/invoice')


const updatePaymentStatus = async(req, res) => {
    try {

        const {id, status} = req.body;
        
        if(!id){
            return res.status(400).json({
                success: false,
                message: "Invoice ID is required to delete the invoice"
            })
        }

        if(!status){
            return res.status(400).json({
                success: false,
                message: "Payment status not found!"
            })
        }

        const updatedInvoice = await Invoice.findOneAndUpdate({invoiceNumber: id}, {
            paymentStatus: status
        })

        if(updatedInvoice){
            return res.status(200).json({
                success: true,
                message: "Payment status updated successfully!"
            })
        }

        return res.status(400).json({
            success: false,
            message: "Something wrong while updating the payment status!"
        })
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!"
        })
    }
}

module.exports = updatePaymentStatus;