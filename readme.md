IGNIS Website is Portfolio Website for "IGNIS Fire and Pixel light performance".
_It isn't available, make for developer portfolio_

It's have 5 page

- Home page
- Performance Page
- Fire pic page
- Pixel light page
- Contact Page

Contact Add-on this function for complete form tag
<!-- use Google Apps Script for sent form information -->
<!-- function doPost(e) {
const sheet = SpreadsheetApp.openById('YOUR_SPREADSHEET_ID'); 
// แทนที่ด้วย ID ของ Google Sheets
const ws = sheet.getSheetByName('Sheet1'); // ชื่อ sheet

const data = e.parameter;

// เพิ่มข้อมูลใหม่เข้าไป
ws.appendRow([new Date(), 
// timestamp
data.name,
data.email,
data.phone,
data.message,
data.show
]);

return ContentService
.createTextOutput(JSON.stringify({result: 'success'}))
.setMimeType(ContentService.MimeType.JSON);
} -->
