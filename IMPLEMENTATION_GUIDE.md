# Implementation Guide: Google Sheets Automation with AgentKit

This guide will walk you through setting up the automated system for processing email and crypto transactions using Google Sheets and AgentKit.

## Prerequisites

1. A Google account with access to:
   - Google Sheets
   - Google Apps Script
   - Gmail (for sending emails)
2. AgentKit API key
3. A wallet with:
   - USDC on Base network
   - ETH for gas fees
4. The target Google Sheet with the following columns:
   - Column D: Recipient (email or wallet address)
   - Column E: Token (should be "USDC")
   - Column F: Amount
   - Column G: Done
   - Column H: Date Sent

## Setup Instructions

### 1. Google Apps Script Setup

1. Open your Google Sheet
2. Click on "Extensions" > "Apps Script"
3. In the Apps Script editor:
   - Delete any existing code in Code.gs
   - Create two new files:
     - `updateGoogleSheet.js`: Copy contents from the repository
     - `config.js`: Copy contents from the repository

### 2. Configure Authentication

1. In `config.js`, replace the placeholder values:
   ```javascript
   auth: {
       agentKitApiKey: 'YOUR_AGENTKIT_API_KEY_HERE',
       privateKey: 'YOUR_PRIVATE_KEY_HERE'
   }
   ```

### 3. Set Up the Time Trigger

1. In the Apps Script editor:
   - Click "Run" > "Run function" > "initialize"
   - Grant necessary permissions when prompted
   - This will create a daily trigger for 2 PM

### 4. Test the Setup

1. Add a test row to your spreadsheet with:
   - An email address in Column D
   - "USDC" in Column E
   - A small amount in Column F
   - Leave columns G and H empty

2. Run a manual test:
   - In Apps Script, run the "manualUpdate" function
   - Check the execution logs for any errors
   - Verify the spreadsheet updates correctly

## Spreadsheet Requirements

1. Column Headers:
   - Column D: "Recipient"
   - Column E: "Token"
   - Column F: "Amount"
   - Column G: "Done"
   - Column H: "Date Sent"

2. Data Format:
   - Recipient: Either email address or Base wallet address (0x...)
   - Token: Must be "USDC"
   - Amount: Numeric value (decimal points allowed)
   - Done: Leave empty (script will fill with "Y")
   - Date Sent: Leave empty (script will fill with timestamp)

## Security Considerations

1. API Key and Private Key:
   - Never share or commit these values
   - Store them securely
   - Regularly rotate keys if possible

2. Permissions:
   - Only grant necessary Google Sheets permissions
   - Regularly review Apps Script permissions

3. Transaction Monitoring:
   - Regularly check execution logs
   - Monitor wallet balances
   - Set up alerts for failed transactions

## Troubleshooting

### Common Issues:

1. Script not running:
   - Check trigger settings in Apps Script
   - Verify permissions are granted
   - Check execution logs for errors

2. Failed Transactions:
   - Verify wallet has sufficient USDC balance
   - Check ETH balance for gas fees
   - Validate wallet addresses are correct

3. Failed Emails:
   - Check Gmail quota
   - Verify email addresses are valid
   - Check spam folder

### Execution Logs:

1. Access logs:
   - Open Apps Script editor
   - Click "View" > "Execution log"
   - Check for any error messages

2. Common error messages:
   - "Invalid wallet address": Check address format
   - "Insufficient funds": Add more USDC or ETH
   - "Email quota exceeded": Wait for quota reset

## Maintenance

1. Regular Checks:
   - Monitor execution logs daily
   - Verify trigger is running
   - Check wallet balances

2. Updates:
   - Regularly check for AgentKit updates
   - Update gas settings if needed
   - Review and update email template

3. Backup:
   - Regularly backup the spreadsheet
   - Keep copy of script configurations
   - Document any customizations

## Support

For issues with:
- Google Apps Script: Check Google's documentation
- AgentKit: Contact AgentKit support
- Spreadsheet: Review Google Sheets help

Remember to test thoroughly in a development environment before deploying to production!