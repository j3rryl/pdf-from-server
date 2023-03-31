const express = require('express');
const pdfService = require('../service/pdf-service');
const fs = require("fs");
const PDFDocument = require("pdfkit-table");


const router = express.Router();
router.get('/invoice', (req, res, next) => {
  const stream = res.writeHead(200, {
    'Content-Type': 'application/pdf',
    'Content-Disposition': `attachment;filename=invoice.pdf`,
  });
  pdfService.buildPDF(
    (chunk) => stream.write(chunk),
    () => stream.end()
  );
});


router.get("/create-invoice")

router.get("/create-pdf", function (req, res) {

  const fs = require("fs");
  const PDFDocument = require("pdfkit-table");

  let doc = new PDFDocument({ margin: 30, size: 'A4', bufferPages: true, font: 'Courier' });
    // to save on server
  doc.pipe(fs.createWriteStream("./invoice.pdf"));

  doc
  .fontSize(8)
  .text(`Upesy\n
  Physical Address:\n
  Postal Code:\n
  Country:\n
  City:\n`, {align:'left'})
  .text(`Billing To:\n
  UN Habitat\n
  Physical Address:\n
  Postal Code:\n
  Country:\n
  City:\n`,{align:'right'});

  doc.moveDown()


  const tableArray = {
    headers: ["Fee", "Quantitiy", "Unit Price","Total Amount"],
    rows: [
      ["VAT", "1", "16%","KES 567"],
      ["Premium Package", "20", "KES 2,334", "KES 23,000"],
      ["Total", "", "","KES 12,000"],
    ],
  };
  doc.table( tableArray, { width: 300 }); // A4 595.28 x 841.89 (portrait) (about width sizes)

  // move to down
  doc.moveDown(); // separate tables

  // -----------------------------------------------------------------------------------------------------
  // A4 595.28 x 841.89 (portrait) (about width sizes)
  

  doc.table(tableArray, {
    prepareHeader: () => doc.font("Helvetica-Bold").fontSize(8),
    prepareRow: (row, indexColumn, indexRow, rectRow) => doc.font("Helvetica").fontSize(8),
  });

  // if your run express.js server:
  // HTTP response only to show pdf
  doc.pipe(res);

  // done
  doc.end();

  // const stream = res.writeHead(200, {
  //   'Content-Type': 'application/pdf',
  //   'Content-Disposition': `attachment;filename=invoice.pdf`,
  // });
  // doc.buildPDF(
  //   (chunk) => stream.write(chunk),
  //   () => stream.end()
  // );

});


module.exports = router;
