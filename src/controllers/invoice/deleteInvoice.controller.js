const Invoice = require('../../models/invoice');

const deleteInvoice = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if the ID is provided
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Invoice ID is required to delete the invoice.",
            });
        }

        const deletedInvoice = await Invoice.findByIdAndDelete(id);

        // Check if the invoice exists and was deleted
        if (deletedInvoice) {
            return res.status(200).json({
                success: true,
                message: "Invoice deleted successfully!",
            });
        } else {
            return res.status(404).json({
                success: false,
                message: "Invoice not found, or it could not be deleted.",
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

module.exports = deleteInvoice;
