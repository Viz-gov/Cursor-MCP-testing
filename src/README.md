# Google Sheets Automation Script

This script automates the process of updating a Google Spreadsheet when a transaction is sent. It specifically updates the "Done" column with "Y" and the "Date Sent" column with today's date when the `tx_sent()` function returns true.

## Setup Instructions

1. Open your Google Spreadsheet
2. Click on "Extensions" > "Apps Script"
3. Copy the contents of `updateGoogleSheet.js` into the Apps Script editor
4. Replace the placeholder `tx_sent()` function with your actual transaction check logic
5. Save the script
6. Click on "Run" > "manualUpdate" to test the script (make sure to authorize when prompted)

## How It Works

The script:
1. Identifies the "Done" and "Date Sent" columns in your spreadsheet
2. Iterates through each row
3. When `tx_sent()` returns true for a row:
   - Sets "Done" to "Y"
   - Sets "Date Sent" to today's date

## Customizing the Script

### Implementing tx_sent()
Replace the `tx_sent()` function with your actual transaction check logic:

```javascript
function tx_sent() {
  // Add your transaction verification logic here
  // Return true when transaction is confirmed
  // Return false otherwise
}
```

### Automatic Triggers
You can set up automatic triggers to run the script:
1. In Apps Script, click on "Triggers" (clock icon)
2. Click "Add Trigger"
3. Choose the function to run
4. Set the trigger type (time-based, on edit, etc.)

## Troubleshooting

1. Make sure you have edit permissions on the spreadsheet
2. Check that column names match exactly ("Done" and "Date Sent")
3. Verify that the `tx_sent()` function is properly implemented
4. Check the Apps Script execution logs for any errors