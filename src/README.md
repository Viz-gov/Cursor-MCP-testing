# Google Sheets Automation Script with AgentKit Integration

This script automates the process of sending either crypto transactions or thank you emails based on the recipient type in your Google Spreadsheet. It updates the "Done" column with "Y" and the "Date Sent" column with today's date upon successful completion.

## Spreadsheet Structure

The script expects the following columns:
- Column D: Recipient (email address or wallet address)
- Column E: Token (for crypto transactions)
- Column F: Amount (for crypto transactions)
- "Done" column: Status indicator
- "Date Sent" column: Timestamp of completion

## Features

1. **Email Processing**
   - Detects email addresses in Column D
   - Sends thank you email with Amazon gift card information
   - Updates status upon successful sending

2. **Crypto Transactions**
   - Detects wallet addresses in Column D
   - Uses AgentKit to send specified token amount
   - Waits for transaction confirmation
   - Updates status upon successful transaction

## Setup Instructions

1. Open your Google Spreadsheet
2. Click on "Extensions" > "Apps Script"
3. Copy the contents of `updateGoogleSheet.js` into the Apps Script editor
4. Configure the following:
   - Amazon gift card details in the `sendThankYouEmail` function
   - AgentKit configuration (API keys, network settings)
5. Save the script
6. Click on "Run" > "manualUpdate" to test the script (make sure to authorize when prompted)

## Configuration

### Email Template
Modify the email template in `sendThankYouEmail()`:
```javascript
const body = `Dear Participant,
Thank you for participating in our research study...`;
```

### AgentKit Configuration
Add your AgentKit configuration in `sendCryptoTransaction()`:
```javascript
const agentkit = new AgentKit({
  // Add your configuration here
});
```

## Error Handling

The script includes error handling for both email and crypto transactions:
- Failed transactions are logged
- The spreadsheet is only updated on successful completion
- Each row is processed independently

## Troubleshooting

1. Check the Apps Script execution logs for detailed error messages
2. Verify that email addresses and wallet addresses are properly formatted
3. Ensure AgentKit is properly configured with necessary API keys
4. Confirm sufficient balance for crypto transactions
5. Check Gmail quota for email sending

## Security Considerations

1. Store sensitive information (API keys, private keys) securely
2. Use appropriate permissions for the Google Sheet
3. Regularly monitor transaction logs
4. Consider implementing rate limiting for large sheets

## Dependencies

- Google Apps Script
- Gmail API (for emails)
- AgentKit (for crypto transactions)

For any questions or issues, please check the execution logs or create an issue in the repository.