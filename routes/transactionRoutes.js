// const express = require('express');
// const router = express.Router();
// // const transactionController = require('../controllers/transactionController');
// const mongoose = require('mongoose');
// const Transaction = require('../models/transaction');
// const Account = require('../models/account');


// Route to create a new transaction
// router.post('/', transactionController.createTransaction);

// Route to fetch all transactions for a specific account
// router.get('/account/:accountId', transactionController.getAllTransactionsForAccount);

// Other routes for updating and deleting transactions can be defined similarly



// // Make a withdrawal from an account
// router.post("/api/accounts/:accountId/withdrawal", async (req, res) => {
//     try {
//         const accountId = req.params.accountId;
//         const { amount } = req.body;
//         const account = await Account.findById(accountId);
//         if (!account) {
//             return res.status(404).json({ error: "Account not found" });
//         }
//         // Your withdrawal logic here
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });




// //Fixes


// router.post('/api/accounts/:accountId/transactions', async (req, res) => {
//   try {
//     const { accountId } = req.params;
//     const { amount } = req.body;

//     // Validate the accountId parameter
//     if (!mongoose.Types.ObjectId.isValid(accountId)) {
//       return res.status(400).json({ error: 'Invalid account ID' });
//     }

//     // Find the account
//     const account = await Account.findById(accountId);
//     if (!account) {
//       return res.status(404).json({ error: 'Account not found' });
//     }

//     // Create a new transaction
//     const transaction = new Transaction({ amount, account: accountId });
//     await transaction.save();

//     // Update the account with the new transaction
//     account.transactions.push(transaction._id);
//     await account.save();

//     res.status(201).json({ transaction });
//   } catch (error) {
//     console.error('Error creating transaction:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// router.get('/api/accounts/:accountId/transactions', async (req, res) => {
//   try {
//     const { accountId } = req.params;

//     // Validate the accountId parameter
//     if (!mongoose.Types.ObjectId.isValid(accountId)) {
//       return res.status(400).json({ error: 'Invalid account ID' });
//     }

//     const account = await Account.findById(accountId).populate('transactions');
//     if (!account) {
//       return res.status(404).json({ error: 'Account not found' });
//     }

//     const transactions = account.transactions;
//     res.status(200).json({ transactions });
//   } catch (error) {
//     console.error('Error fetching transactions:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// module.exports = router;

// EDITED TRANSACTION ROUTES OH!

const express = require('express');
const bcrypt = require('bcryptjs');
const Account = require('../models/account');
const Transaction = require('../models/transaction');

const router = express.Router();


const createTransaction = async (accountId, amount, type) => {
  const transaction = new Transaction({ type, amount, account: accountId });
  await transaction.save();

  const account = await Account.findById(accountId);
  account.transactions.push(transaction._id);
  await account.save();

  return transaction;
};



// Make a withdrawal
router.post('/withdrawals', async (req, res) => {
  try {
    const { accountNumber, amount, password } = req.body;

    if (amount === undefined || amount <= 0) {
      return res.status(400).json({ error: 'Invalid withdrawal amount' });
    }

    const account = await Account.findOne({ accountNumber });
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, account.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const today = new Date();
    const isSameDay = account.lastWithdrawalDate && account.lastWithdrawalDate.toDateString() === today.toDateString();

    if (!isSameDay) {
      account.withdrawalAmountToday = 0;
    }

    if ((account.withdrawalAmountToday + amount) > account.dailyWithdrawalLimit) {
      return res.status(400).json({ error: 'Exceeds daily withdrawal limit' });
    }

    account.balance -= amount;
    account.withdrawalAmountToday += amount;
    account.lastWithdrawalDate = today;
    await account.save();

    const transaction = new Transaction({
      type: 'Withdrawal',
      amount: -amount,
      account: account._id,
    });

    await transaction.save();

    res.status(200).json({ message: 'Withdrawal successful', balance: account.balance });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
    console.error(error);
  }
});


// Fetch transactions for an account
router.get('/:accountNumber', async (req, res) => {
  try {
    const { accountNumber } = req.params;

    const transactions = await Transaction.find({ account: accountNumber });
    // if (!account) {
    //   return res.status(404).json({ error: 'Account not found' });
    // }

    res.status(200).json({ transactions: transactions });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
    console.error(error);
  }
});

module.exports = router;
