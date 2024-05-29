const mongoose = require('mongoose');


const createTransaction = async (accountId, amount, type) => {
  try {
    // Create a new transaction object with proper association to the account
    const transaction = new Transaction({ type, amount, account: accountId });

    // Save the transaction to the database
    await transaction.save();

    // Retrieve the associated account
    const account = await Account.findById(accountId);

    // Update the account's transactions array with the new transaction's ID
    account.transactions.push(transaction._id);

    // Save the updated account
    await account.save();

    // Return the created transaction
    return transaction;
  } catch (error) {
    // Handle any errors that occur during transaction creation
    console.error('Error creating transaction:', error);
    throw error; // Propagate the error for further handling
  }
};


const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  // transaction: {
  //   type: Array,
  //   default: []
  // }
});

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;





// Initial CODE
// const mongoose = require('mongoose');

// const transactionSchema = new mongoose.Schema({
//   amount: {
//     type: Number,
//     required: true
//   },
//   date: {
//     type: Date,
//     default: Date.now
//   },
//   account: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Account',
//     required: true
//   }
// });

// const Transaction = mongoose.model('Transaction', transactionSchema);

// module.exports = Transaction;





