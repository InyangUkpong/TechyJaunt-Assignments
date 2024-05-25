const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const Account = require('../models/account');
const mongoose = require('mongoose');
// Route to create a new account
router.post('/', accountController.createAccount);

// Route to fetch all accounts
router.get('/', accountController.getAllAccounts);

// Route to fetch single account
router.get('/:accountId', accountController.getAccountById);

// Other routes for updating and deleting accounts can be defined similarly

// Route for fetching all transactions for a given account

router.get('/api/accounts/:accountId/transactions', async (req, res) => {
    try {
        const { accountId } = req.params;

        // This Validates the accountId parameter
        if (!mongoose.Types.ObjectId.isValid(accountId)) {
        return res.status(400).json({ error: 'Invalid account ID' });
        }

        // const account = await Account.findById(accountId).populate('transactions');

        const account = await Account.findById(accountId).populate({
            path: 'transactions',
            model: 'Transaction' // This shoulc explicitly specifying the model
          });
        if (!account) {
        return res.status(404).json({ error: 'Account not found' });
        }


        // test loging account and transaction for debugging
        console.log('Account:', account);
        console.log('Populated Transactions:', account.transactions);

        // Make sure the populated transactions are returned
        const transactions = account.transactions;
        res.status(200).json({ transactions });
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
    });


// Update daily withdrawal limit for an account
router.post("/api/accounts/:accountId/daily-withdrawal-limit", async (req, res) => {
    try {
        const accountId = req.params.accountId;
        const { dailyWithdrawalLimit } = req.body;
        const updatedAccount = await Account.findByIdAndUpdate(accountId, { dailyWithdrawalLimit }, { new: true });
        res.status(200).json(updatedAccount);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



module.exports = router;

