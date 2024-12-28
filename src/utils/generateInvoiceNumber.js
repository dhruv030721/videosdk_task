const generateInvoiceNumber = () => {
    const prefix = "INV";

    const date = new Date();

    const formattedDate = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;

    const randomNumber = Math.floor(1000 + Math.random() * 9000);

    const invoiceNumber = `${prefix}-${formattedDate}-${randomNumber}`;
    return invoiceNumber;
}



module.exports = {generateInvoiceNumber};