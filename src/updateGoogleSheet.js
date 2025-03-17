// Google Apps Script code to update spreadsheet
function onTxSent() {
  // Get the active spreadsheet
  const spreadsheet = SpreadsheetApp.openById('182xKCPYmQVLKdR2WTwix0Oh9kXQ_jHPPBDA_2o5Fovc');
  const sheet = spreadsheet.getActiveSheet();
  
  // Get all data from the sheet
  const data = sheet.getDataRange().getValues();
  
  // Find column indices
  const headers = data[0];
  const recipientColIndex = headers.indexOf('Recipient'); // Column D
  const tokenColIndex = headers.indexOf('Token'); // Column E
  const amountColIndex = headers.indexOf('Amount'); // Column F
  const doneColIndex = headers.indexOf('Done');
  const dateSentColIndex = headers.indexOf('Date Sent');
  
  // Iterate through rows
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const recipient = row[recipientColIndex];
    const token = row[tokenColIndex];
    const amount = row[amountColIndex];
    
    // Skip if already done
    if (row[doneColIndex] === 'Y') continue;
    
    // Check if recipient is email or wallet address
    const isEmail = recipient.includes('@');
    
    if (isEmail) {
      // Handle email case
      if (sendThankYouEmail(recipient)) {
        updateRowStatus(sheet, i + 1, doneColIndex, dateSentColIndex);
      }
    } else {
      // Handle crypto transaction case
      if (sendCryptoTransaction(recipient, token, amount)) {
        updateRowStatus(sheet, i + 1, doneColIndex, dateSentColIndex);
      }
    }
  }
}

// Function to send thank you email with Amazon gift card
function sendThankYouEmail(email) {
  try {
    const subject = 'Thank You for Participating in Our Research';
    const body = `Dear Participant,

Thank you for participating in our research study. We greatly appreciate your time and valuable input.

As a token of our appreciation, we would like to provide you with an Amazon gift card. [Insert Gift Card Details/Link]

Best regards,
Research Team`;

    GmailApp.sendEmail(email, subject, body);
    return true;
  } catch (error) {
    Logger.log('Error sending email: ' + error.toString());
    return false;
  }
}

// Function to send crypto transaction using AgentKit
function sendCryptoTransaction(walletAddress, token, amount) {
  try {
    // AgentKit implementation
    const agentkit = new AgentKit();
    
    // Configure the transaction
    const tx = {
      to: walletAddress,
      token: token,
      amount: amount
    };
    
    // Send the transaction
    const result = agentkit.sendTransaction(tx);
    
    // Wait for confirmation
    return agentkit.waitForConfirmation(result.txHash);
  } catch (error) {
    Logger.log('Error sending crypto transaction: ' + error.toString());
    return false;
  }
}

// Helper function to update row status
function updateRowStatus(sheet, rowIndex, doneColIndex, dateSentColIndex) {
  sheet.getRange(rowIndex, doneColIndex + 1).setValue('Y');
  sheet.getRange(rowIndex, dateSentColIndex + 1).setValue(new Date());
}

// Function to manually trigger the update
function manualUpdate() {
  onTxSent();
}