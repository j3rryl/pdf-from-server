const express = require('express');
const router = require('./routes');
var cron = require('node-cron');

// https://stackoverflow.com/questions/58090447/expressjs-and-pdfkit-generate-a-pdf-in-memory-and-send-to-client-for-download

const app = express();
app.use(express.json());
app.use(router);

// cron.schedule('*/3 * * * * *', () => {
//     console.log('running a task every 3 seconds');
//   });

app.listen(8080, () => console.log('server running on port 8080'));
