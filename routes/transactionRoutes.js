const express = require('express');
const router = express.Router();
// const transactionController = require('../controllers/transactionController');
const mongoose = require('mongoose');
const Transaction = require('../models/transaction');
const Account = require('../models/account');


// Route to create a new transaction
// router.post('/', transactionController.createTransaction);

// Route to fetch all transactions for a specific account
// router.get('/account/:accountId', transactionController.getAllTransactionsForAccount);

// Other routes for updating and deleting transactions can be defined similarly



// Make a withdrawal from an account
router.post("/api/accounts/:accountId/withdrawal", async (req, res) => {
    try {
        const accountId = req.params.accountId;
        const { amount } = req.body;
        const account = await Account.findById(accountId);
        if (!account) {
            return res.status(404).json({ error: "Account not found" });
        }
        // Your withdrawal logic here
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Adding a new endpoint to create a transaction and update account:

// router.post('/api/accounts/:accountId/transactions', async (req, res) => {
//     try {
//         const { accountId } = req.params;
//         const { amount } = req.body;

        // Validate the accountId parameter
//         if (!mongoose.Types.ObjectId.isValid(accountId)) {
//         return res.status(400).json({ error: 'Invalid account ID' });
//         }

        // Find the account
//         const account = await Account.findById(accountId);
//         if (!account) {
//         return res.status(404).json({ error: 'Account not found' });
//         }

        // Create a new transaction
//         const transaction = new Transaction({ amount, account: accountId });
//         await transaction.save();

        // Update the account with the new transaction
//         account.transactions.push(transaction._id);
//         await account.save();

//         res.status(201).json({ transaction });
//     } catch (error) {
//         console.error('Error creating transaction:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
//     });

//     router.get('/api/accounts/:accountID/transactions', async (req, res) => {
//         try {
//             const { accountId } = req.params;

            // validate accountId params
//             if (!mongoose.Types.ObjectId.isValid(accountId)) {
//                 return res.status(400).json({ error: 'Invalid account ID' });
//             }


//             const account = await Account.findById(accountId);
//             if (!account) {
//                 return res.status(404).json({ error: 'Account not found' });
//             }
            
//             const transactions = account.transactions;
//             res.status(200).json({ transactions });
//         } catch (error) {
//             console.error('Error fetching transactions:', error);
//             res.status(500).json({ error: 'Internal server error' });
//         }
//     })



// module.exports = router;


//Fixes


router.post('/api/accounts/:accountId/transactions', async (req, res) => {
  try {
    const { accountId } = req.params;
    const { amount } = req.body;

    // Validate the accountId parameter
    if (!mongoose.Types.ObjectId.isValid(accountId)) {
      return res.status(400).json({ error: 'Invalid account ID' });
    }

    // Find the account
    const account = await Account.findById(accountId);
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    // Create a new transaction
    const transaction = new Transaction({ amount, account: accountId });
    await transaction.save();

    // Update the account with the new transaction
    account.transactions.push(transaction._id);
    await account.save();

    res.status(201).json({ transaction });
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/api/accounts/:accountId/transactions', async (req, res) => {
  try {
    const { accountId } = req.params;

    // Validate the accountId parameter
    if (!mongoose.Types.ObjectId.isValid(accountId)) {
      return res.status(400).json({ error: 'Invalid account ID' });
    }

    const account = await Account.findById(accountId).populate('transactions');
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    const transactions = account.transactions;
    res.status(200).json({ transactions });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
