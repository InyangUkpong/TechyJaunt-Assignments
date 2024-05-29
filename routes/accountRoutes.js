// const express = require('express');
// const bcrypt = require('bcrypt');
// const router = express.Router();
// const accountController = require('../controllers/accountController');
// const Account = require('../models/account');
// const mongoose = require('mongoose');
// Route to create a new account
// router.post('/', accountController.createAccount);

// // Route to fetch all accounts
// router.get('/', accountController.getAllAccounts);

// // Route to fetch single account
// router.get('/:accountId', accountController.getAccountById);

// // Other routes for updating and deleting accounts can be defined similarly

// // Route for fetching all transactions for a given account

// router.get('/api/accounts/:accountId/transactions', async (req, res) => {
//     try {
//         const { accountId } = req.params;

//         // This Validates the accountId parameter
//         if (!mongoose.Types.ObjectId.isValid(accountId)) {
//         return res.status(400).json({ error: 'Invalid account ID' });
//         }

//         // const account = await Account.findById(accountId).populate('transactions');

//         const account = await Account.findById(accountId).populate({
//             path: 'transactions',
//             model: 'Transaction' // This shoulc explicitly specifying the model
//           });
//         if (!account) {
//         return res.status(404).json({ error: 'Account not found' });
//         }


//         // test loging account and transaction for debugging
//         console.log('Account:', account);
//         console.log('Populated Transactions:', account.transactions);

//         // Make sure the populated transactions are returned
//         const transactions = account.transactions;
//         res.status(200).json({ transactions });
//     } catch (error) {
//         console.error('Error fetching transactions:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
//     });


// // Update daily withdrawal limit for an account
// router.post("/api/accounts/:accountId/daily-withdrawal-limit", async (req, res) => {
//     try {
//         const accountId = req.params.accountId;
//         const { dailyWithdrawalLimit } = req.body;
//         const updatedAccount = await Account.findByIdAndUpdate(accountId, { dailyWithdrawalLimit }, { new: true });
//         res.status(200).json(updatedAccount);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });



// module.exports = router;



// EDITED ROUTES OH!

const express = require('express');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Account = require('../models/account');
const Transaction = require('../models/transaction');

const router = express.Router();

// Function to generate a random account number
const generateAccountNumber = async () => {
  let accountNumber;
  let accountExists = true;

  while (accountExists) {
    accountNumber = Math.floor(1000000000 + Math.random() * 9000000000);
    const existingAccount = await Account.findOne({ accountNumber });
    accountExists = !!existingAccount;
  }

  return accountNumber;
};

// Register a new account
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: 'firstName, lastName, email, and password are required' });
    }

    const accountNumber = await generateAccountNumber();
    const hashPassword = await bcrypt.hash(password, 10);

    const newAccount = new Account({
      firstName,
      lastName,
      email,
      password: hashPassword,
      accountNumber,
    });

    await newAccount.save();
    //remove password from the response
    newAccount.password = undefined;
    res.status(201).json(newAccount);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error(error);
  }
});

// Update daily withdrawal limit
router.put('/:accountId/daily-withdrawal-limit', async (req, res) => {
  try {
    const accountId = req.params.accountId;
    const limit = req.body.dailyWithdrawalLimit;

    const account = await Account.findByIdAndUpdate(
      accountId,
      { dailyWithdrawalLimit: limit },
      { new: true }
    );

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    res.json({ message: 'Daily withdrawal limit updated', account });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
    console.error(error);
  }
});

// Fetch transactions for an account
router.get('/:accountNumber/transactions', async (req, res) => {
  try {
    const { accountNumber } = req.params;

    const account = await Account.findOne({ accountNumber }).populate('transactions');
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    res.status(200).json({ transactions: account.transactions });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
    console.error(error);
  }
});

module.exports = router;
