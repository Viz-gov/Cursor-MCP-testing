// Function to create time-based trigger
function createDailyTrigger() {
  // Delete any existing triggers
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => ScriptApp.deleteTrigger(trigger));
  
  // Create a new trigger to run at 2 PM every day
  ScriptApp.newTrigger('onTxSent')
    .timeBased()
    .everyDays(1)
    .atHour(14)
    .create();
}

// Google Apps Script code to update spreadsheet
function onTxSent() {
  // Get the active spreadsheet
  const spreadsheet = SpreadsheetApp.openById('182xKCPYmQVLKdR2WTwix0Oh9kXQ_jHPPBDA_2o5Fovc');
  const sheet = spreadsheet.getActiveSheet();
  
  // Get all data from the sheet
  const data = sheet.getDataRange().getValues();
  
  // Find column indices
  const headers = data[0];
  const recipientColIndex = 3;  // Column D (0-based)
  const tokenColIndex = 4;      // Column E (0-based)
  const amountColIndex = 5;     // Column F (0-based)
  const doneColIndex = 6;       // Column G (0-based)
  const dateSentColIndex = 7;   // Column H (0-based)
  
  // Initialize AgentKit
  const agentkit = new AgentKit({
    apiKey: CONFIG.auth.agentKitApiKey,
    network: CONFIG.network,
    privateKey: CONFIG.auth.privateKey
  });
  
  // Iterate through rows
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    
    // Check if Done and Date Sent columns are empty
    if (row[doneColIndex] !== '' || row[dateSentColIndex] !== '') {
      continue;  // Skip if either column is not empty
    }
    
    const recipient = row[recipientColIndex];
    const token = row[tokenColIndex];
    const amount = row[amountColIndex];
    
    // Skip if any required field is empty
    if (!recipient || !token || !amount) {
      Logger.log(`Skipping row ${i + 1}: Missing required information`);
      continue;
    }
    
    // Check if recipient is email or wallet address
    const isEmail = recipient.includes('@');
    
    if (isEmail) {
      // Handle email case
      if (sendThankYouEmail(recipient)) {
        updateRowStatus(sheet, i + 1, doneColIndex, dateSentColIndex);
      }
    } else {
      // Handle crypto transaction case
      if (sendCryptoTransaction(agentkit, recipient, token, amount)) {
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
    Logger.log(`Email sent successfully to: ${email}`);
    return true;
  } catch (error) {
    Logger.log('Error sending email: ' + error.toString());
    return false;
  }
}

// Function to send crypto transaction using AgentKit
async function sendCryptoTransaction(agentkit, walletAddress, token, amount) {
  try {
    // Validate the token is USDC
    if (token.toUpperCase() !== 'USDC') {
      throw new Error('Only USDC transactions are supported');
    }

    // Validate wallet address format
    if (!walletAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      throw new Error('Invalid wallet address format');
    }

    // Convert amount to proper decimals (USDC has 6 decimals)
    const amountInDecimals = amount * Math.pow(10, CONFIG.tokens.USDC.decimals);
    
    // Configure the transaction
    const tx = {
      to: walletAddress,
      token: CONFIG.tokens.USDC.address,
      amount: amountInDecimals.toString(),
      maxGasPrice: CONFIG.transaction.maxGasPrice
    };
    
    // Send the transaction
    const result = await agentkit.sendTransaction(tx);
    Logger.log(`Transaction sent: ${result.txHash}`);
    
    // Wait for confirmation
    const confirmed = await agentkit.waitForConfirmation(result.txHash, {
      confirmations: CONFIG.transaction.confirmationBlocks
    });

    if (!confirmed) {
      throw new Error('Transaction failed to confirm');
    }

    Logger.log(`Transaction confirmed: ${result.txHash}`);
    return true;
  } catch (error) {
    Logger.log('Error sending crypto transaction: ' + error.toString());
    return false;
  }
}

// Helper function to update row status
function updateRowStatus(sheet, rowIndex, doneColIndex, dateSentColIndex) {
  try {
    sheet.getRange(rowIndex, doneColIndex + 1).setValue('Y');
    sheet.getRange(rowIndex, dateSentColIndex + 1).setValue(new Date());
    Logger.log(`Updated status for row ${rowIndex}`);
  } catch (error) {
    Logger.log(`Error updating row status: ${error.toString()}`);
  }
}

// Function to manually trigger the update
function manualUpdate() {
  onTxSent();
}

// Function to initialize the script
function initialize() {
  createDailyTrigger();
  Logger.log('Daily trigger created for 2 PM');
}