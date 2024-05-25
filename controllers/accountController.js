const Account = require('../models/account');
// const jwt = require('jaswonwebtoken');


// Controller function to create a new account
exports.createAccount = async (req, res) => {
    try {
        const { accountNumber, firstName, lastName } = req.body;
        const account = new Account({ accountNumber, firstName, lastName });
        await account.save();
        res.status(201).json({ message: "Account created successfully", account });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controller function to fetch all accounts
exports.getAllAccounts = async (req, res) => {
    try {
        const accounts = await Account.find();
        res.status(200).json(accounts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Other controller functions for updating, deleting, and fetching single accounts can be implemented similarly

// Controller function to fetch a single account by ID
exports.getAccountById = async (req, res) => {
    try {
        const accountId = req.params.accountId;
        const account = await Account.findById(accountId);
        if (!account) {
            return res.status(404).json({ message: "Account not found" });
        }
        res.status(200).json(account);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controller function to update an existing account
exports.updateAccount = async (req, res) => {
    try {
        const accountId = req.params.accountId;
        const updates = req.body;
        const options = { new: true };
        const updatedAccount = await Account.findByIdAndUpdate(accountId, updates, options);
        if (!updatedAccount) {
            return res.status(404).json({ message: "Account not found" });
        }
        res.status(200).json({ message: "Account updated successfully", account: updatedAccount });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controller function to delete an existing account
exports.deleteAccount = async (req, res) => {
    try {
        const accountId = req.params.accountId;
        const deletedAccount = await Account.findByIdAndDelete(accountId);
        if (!deletedAccount) {
            return res.status(404).json({ message: "Account not found" });
        }
        res.status(200).json({ message: "Account deleted successfully", account: deletedAccount });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
