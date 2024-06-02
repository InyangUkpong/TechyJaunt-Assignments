const Account = require('../models/account');
const bcrypt = require('bycrptjs');
// const jwt = require('jaswonwebtoken');

const generateAccountNumber = async () => {
    let accountNumber;
    let accountExists = true;
  
    while (accountExists) {
      // Generate a random 10-digit account number
      accountNumber = Math.floor(1000000000 + Math.random() * 9000000000);
  
      // Check if the account number already exists in the database
      const existingAccount = await Account.findOne({ accountNumber });
      accountExists = !!existingAccount;
    }
  
    return accountNumber;
  };

// Controller function to create a new account
exports.createAccount = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
    
        // Check if all required fields are provided
        if (!firstName || !lastName || !email || !password) {
          return res.status(400).json({
            error: "Name, email, and password are required",
          });
        }
    
        // Generate a unique account number
        const accountNumber = await generateAccountNumber();
    
        // Hash the account password
        const hashPassword = await bcrypt.hash(password, 10);
    
        // Create a new account
        const newAccount = new Account({
          firstName,
          lastName,
          email,
          password: hashPassword,
          accountNumber,
        });
    
        // Save the new account to the database
        await newAccount.save();
    
        // Respond with the new account created object
        res.status(201).json(newAccount);
      } catch (error) {
        // Handle any errors that occurred during the save operation
        res.status(500).json({ error: error.message });
        console.error(error);
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
