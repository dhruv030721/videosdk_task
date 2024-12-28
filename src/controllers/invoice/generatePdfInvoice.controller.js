const generatePdfInvoice = async (req, res) => {
    try {

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!"
        })
    }
}

module.exports = generatePdfInvoice;