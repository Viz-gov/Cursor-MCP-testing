const config = require('./config');
const { AgentKit } = require('agentkit');

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
  
  // Initialize AgentKit
  const agentkit = new AgentKit({
    apiKey: config.auth.agentKitApiKey,
    network: config.network,
    privateKey: config.auth.privateKey
  });
  
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

    // Convert amount to proper decimals (USDC has 6 decimals)
    const amountInDecimals = amount * Math.pow(10, config.tokens.USDC.decimals);
    
    // Configure the transaction
    const tx = {
      to: walletAddress,
      token: config.tokens.USDC.address,
      amount: amountInDecimals.toString(),
      maxGasPrice: config.transaction.maxGasPrice
    };
    
    // Send the transaction
    const result = await agentkit.sendTransaction(tx);
    
    // Wait for confirmation
    const confirmed = await agentkit.waitForConfirmation(result.txHash, {
      confirmations: config.transaction.confirmationBlocks
    });

    if (!confirmed) {
      throw new Error('Transaction failed to confirm');
    }

    Logger.log('Transaction successful: ' + result.txHash);
    return true;
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