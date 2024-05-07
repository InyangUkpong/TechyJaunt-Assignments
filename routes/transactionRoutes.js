const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// Route to create a new transaction
router.post('/', transactionController.createTransaction);

// Route to fetch all transactions for a specific account
router.get('/account/:accountId', transactionController.getAllTransactionsForAccount);

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




module.exports = router;
