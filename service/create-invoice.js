const fs = require("fs");
const PDFDocument = require("pdfkit");

function createInvoice(invoice,res, path) {
  let doc = new PDFDocument({ size: "A4", margin: 50 });
  // to save on server
  doc.pipe(fs.createWriteStream("./invoice.pdf"));
  generateHeader(doc,invoice);
  generateCustomerInformation(doc, invoice);
  generateInvoiceTable(doc, invoice);
  generateFooter(doc);

  doc.pipe(res);
  doc.end();
//   const stream = res.writeHead(200, {
//     'Content-Type': 'application/pdf',
//     'Content-Disposition': `attachment;filename=invoice.pdf`,
//   });
//   doc.buildPDF(
//     (chunk) => stream.write(chunk),
//     () => stream.end()
//   );
}

function generateHeader(doc,invoice) {
  const top = 50
  doc
  .image("logo.png", 50, 45, { width: 30 })
    .fontSize(18)
    .text("G4S Security", 110, top)
    .font("Helvetica")
    .fontSize(10)
    .font("Helvetica-Bold")
    .text("Invoice Number:", 350, top )
    .font("Helvetica-Bold")
    .text(invoice.invoice_nr, 450, top )
    .font("Helvetica")
    .text("Invoice Date:", 350, top + 15)
    .text(formatDate(new Date()), 450, top + 15)
    .text("Balance Due:", 350, top + 30)
    .text(
      formatCurrency(invoice.subtotal - invoice.paid),
      450,
      top + 30
    )
    .moveDown();
}

function generateCustomerInformation(doc, invoice) {
  doc
    .fillColor("#444444")
    .fontSize(14)
    .text("Invoice From", 50, 160);

    doc
    .fillColor("#444444")
    .fontSize(14)
    .text("Invoice To", 350, 160);

  generateHr(doc, 185);

  let customerInformationTop = 200;

  doc
    .fillColor("#444444")
    .fontSize(10)
    .font("Helvetica-Bold")
    .text("G4S Security", 50, customerInformationTop)
    .font("Helvetica")
    .text("10900 Muthithi", 50, customerInformationTop + 15)
    .text("Nairobi ", 50, customerInformationTop + 30)
    .text("Kenya", 50, customerInformationTop + 45)


    .font("Helvetica-Bold")
    .text(invoice.shipping.name, 350, customerInformationTop)
    .font("Helvetica")
    .text(invoice.shipping.address, 350, customerInformationTop + 15)
    .text(
      invoice.shipping.city +
        ", " +
        invoice.shipping.state,
      350,
      customerInformationTop + 30
    )
    .text(invoice.shipping.country, 350, customerInformationTop + 45)
    .moveDown();
  generateHr(doc, 267);
}

function generateInvoiceTable(doc, invoice) {
  let i;
  const invoiceTableTop = 330;

  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    invoiceTableTop,
    "Item",
    "Description",
    "Unit Cost",
    "Quantity",
    "Total"
  );
  generateHr(doc, invoiceTableTop + 20);
  doc.font("Helvetica");

  for (i = 0; i < invoice.items.length; i++) {
    const item = invoice.items[i];
    const position = invoiceTableTop + (i + 1) * 30;
    generateTableRow(
      doc,
      position,
      item.item,
      item.description,
      formatCurrency(item.amount / item.quantity),
      item.quantity,
      formatCurrency(item.amount)
    );

    generateHr(doc, position + 20);
  }

  const subtotalPosition = invoiceTableTop + (i + 1) * 30;
  generateTableRow(
    doc,
    subtotalPosition,
    "",
    "",
    "Subtotal",
    "",
    formatCurrency(invoice.subtotal)
  );

  const paidToDatePosition = subtotalPosition + 20;
  generateTableRow(
    doc,
    paidToDatePosition,
    "",
    "",
    "Paid To Date",
    "",
    formatCurrency(invoice.paid)
  );

  const duePosition = paidToDatePosition + 25;
  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    duePosition,
    "",
    "",
    "Balance Due",
    "",
    formatCurrency(invoice.subtotal - invoice.paid)
  );
  doc.font("Helvetica");
}

function generateFooter(doc) {
  doc
    .fontSize(10)
    .text(
      "Payment is due within 15 days. Thank you for your business.",
      50,
      780,
      { align: "center", width: 500 }
    );
}

function generateTableRow(
  doc,
  y,
  item,
  description,
  unitCost,
  quantity,
  lineTotal
) {
  doc
    .fontSize(10)
    .text(item, 50, y)
    .text(description, 150, y)
    .text(unitCost, 280, y, { width: 90, align: "right" })
    .text(quantity, 370, y, { width: 90, align: "right" })
    .text(lineTotal, 0, y, { align: "right" });
}

function generateHr(doc, y) {
  doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(50, y)
    .lineTo(550, y)
    .stroke();
}

function formatCurrency(cents) {
  return "KES " + (cents / 100).toFixed(2);
}

function formatDate(date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return year + "/" + month + "/" + day;
}

module.exports = {
  createInvoice
};