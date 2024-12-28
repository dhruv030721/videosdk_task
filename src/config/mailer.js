const nodemailer = require('nodemailer')

const MailSender = async (fromMail = 'Invoice Generator - <invoicegenerator@videosdk.com>', toMail, title, pdfBuffer, invoiceData) => {
    try {
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        })

        let info = await transporter.sendMail({
            from: fromMail,
            to: toMail,
            subject: `Invoice ${invoiceData.invoiceNumber}`,
            text: 'Please find your invoice attached.',
            attachments: [
                {
                    filename: `invoice-${invoiceData.invoiceNumber}.pdf`,
                    content: pdfBuffer,
                },
            ],
        })

        return info;

    } catch (error) {
        console.log(error);
    }
}

module.exports = MailSender;