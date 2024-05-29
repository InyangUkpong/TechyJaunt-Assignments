const Transaction = require('../models/transaction');
const Account = require('../models/account');

// Controller function to create a new transaction

// transactionController.js.

// Function to create a new transaction
const createTransaction = async (accountId, amount, type) => {
  try {
    const transaction = new Transaction({ type, amount, account: accountId });
    await transaction.save();

    const account = await Account.findById(accountId);
    account.transactions.push(transaction._id);
    await account.save();

    return transaction;
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw error;
  }
};

// Other transaction-related controller functions can go here...

module.exports = { createTransaction };
