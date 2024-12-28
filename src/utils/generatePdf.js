const pdf = require('html-pdf');
const { getFormattedDate } = require('./dateValidation')

const createInvoicePDF = (invoiceData) => {
    return new Promise((resolve, reject) => {
        const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Invoice</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                h1 { text-align: center; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ccc; padding: 10px; text-align: left; }
                th { background: #f4f4f4; }
            </style>
        </head>
        <body>
            <h1>Invoice</h1>
            <p">Date: ${getFormattedDate(invoiceData.invoiceDate)}</p>
            <p style="font-weight: bold;">Invoice Number: ${invoiceData.invoiceNumber}</p>
            <p>Due Date: ${getFormattedDate(invoiceData.dueDate)}</p>
            <h3>Customer Details:</h3>
            <p>Name: ${invoiceData.customer.name}</p>
            <p>Email: ${invoiceData.customer.email}</p>
            <p>Phone: ${invoiceData.customer.phone}</p>
            <table>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${invoiceData.items.map((item) => `
                        <tr>
                            <td>${item.name}</td>
                            <td>${item.quantity}</td>
                            <td>&#x20b9;${item.unitPrice.toFixed(2)}</td>
                            <td>&#x20b9;${(item.quantity * item.unitPrice).toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <h4 style="text-align: right;">Tax Rate (+): ${invoiceData.taxRate.toFixed(2)}%</h4>
            <h4 style="text-align: right;">Discount (-): ${invoiceData.discount.toFixed(2)}%</h4>
            <h4 style="text-align: right;">______________________</h4>
            <h4 style="text-align: right;">Total Amount: &#x20b9;${invoiceData.totalAmount.toFixed(2)}</h4>
        </body>
        </html>`;

        const options = { format: 'A4' };

        pdf.create(htmlContent, options).toBuffer((err, buffer) => {
            if (err) {
                return reject(err);
            }
            resolve(buffer);
        });
    });
};

module.exports = createInvoicePDF;
