const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const Account = require("../models/account");

// Route to create a new account
router.post('/', accountController.createAccount);

// Route to fetch all accounts
router.get('/', accountController.getAllAccounts);

// Route to fetch single account
router.get('/:accountId', accountController.getAccountById);

// Other routes for updating and deleting accounts can be defined similarly


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

