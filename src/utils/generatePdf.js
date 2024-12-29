const puppeteer = require('puppeteer');

const createInvoicePDF = async (invoiceData) => {
    let browser;
    if (process.env.ENVIRONMENT == "PROD") {
        browser = await puppeteer.launch({
            executablePath: '/usr/bin/chromium-browser',
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
    } else {
        browser = await puppeteer.launch();
    }
    const page = await browser.newPage();

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
        <p>Date: ${invoiceData.invoiceDate}</p>
        <p><strong>Invoice Number:</strong> ${invoiceData.invoiceNumber}</p>
        <p>Due Date: ${invoiceData.dueDate}</p>
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
            ${invoiceData.items.map(item => `
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
    </html>
  `;

    await page.setContent(htmlContent);
    const pdfBuffer = await page.pdf();

    await browser.close();

    const buffer = Buffer.from(pdfBuffer)

    return buffer;
};

module.exports = createInvoicePDF;
