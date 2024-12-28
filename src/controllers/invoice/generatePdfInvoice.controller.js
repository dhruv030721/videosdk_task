const Invoice = require('../../models/invoice')
const generatePdf = require('../../utils/generatePdf')
const { getFormattedDate } = require('../../utils/dateValidation')

const generatePdfInvoice = async (req, res) => {
    try {

        const { invoiceNumber } = req.params;

        if (!invoiceNumber) {
            return res.status(400).json({
                success: false,
                message: "Invoice ID is required to delete the invoice"
            })
        }

        const invoiceData = await Invoice.findOne({ invoiceNumber: invoiceNumber })

        const pdfBuffer = await generatePdf(invoiceData);

        if (pdfBuffer) {

            // Set headers for PDF download
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=invoice-${invoiceData.invoiceNumber}.pdf`);

            return res.send(pdfBuffer);
        }

        return res.status(400).json({
            success: false,
            message: "Something wrong while creating pdf, Try again later!"
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!"
        })
    }
}

module.exports = generatePdfInvoice;