const Transaction = require('../models/transaction');

// Controller function to create a new transaction
exports.createTransaction = async (req, res) => {
    try {
        const { type, amount, accountId } = req.body;
        const transaction = new Transaction({ type, amount, account: accountId });
        await transaction.save();
        res.status(201).json({ message: "Transaction created successfully", transaction });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controller function to fetch all transactions for a specific account
exports.getAllTransactionsForAccount = async (req, res) => {
    try {
        const accountId = req.params.accountId;
        const transactions = await Transaction.find({ account: accountId });
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Other controller functions for updating, deleting, and fetching single transactions can be implemented similarly
