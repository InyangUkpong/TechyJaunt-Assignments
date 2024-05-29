const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Transaction = require("./models/transaction.js");
const Account = require("./models/account.js");
const transactionRoutes = require("./routes/transactionRoutes");
const accountRoutes = require("./routes/accountRoutes");
const { dbURI } = require("./config");
require("dotenv").config();
const bcrypt = require("bcrypt");

const app = express();
app.use(express.json());
const port = 3000;
app.use(bodyParser.json());
app.use(transactionRoutes);
// Include account routes
app.use(accountRoutes);
app.use(transactionRoutes);

dotenv.config();

//   });

// Connecting to db through TablePlus

mongoose
  .connect(process.env.dbURI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("connection failed");
  });

app.use("/api/accounts", accountRoutes);
app.use("/api/transactions", transactionRoutes);



// Connecting through Atlas
// mongoose.connect("mongodb+srv://inyangweb:ZA32sr7y6oWO3DlZ@backenddb.zkdsvwp.mongodb.net/Node-API?retryWrites=true&w=majority&appName=backendDB")
// .then(() => {
//     console.log("Connected to MongoDB");
//   }).catch((err) => {
//     console.log("connection failed");
// });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Hello from Node API Server");
});

// **************************
// I am defining Api Routes and Controller Here

// Fetch all accounts
app.get("/api/accounts/getall", async (req, res) => {
  try {
    const accounts = await Account.find();
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});


//Modified Create Acct

// Function to generate a random account number
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

app.post("/api/accounts/register", async (req, res) => {
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
});


// Fetch single account
app.get("/api/accounts/:accountId", async (req, res) => {
  try {
    const accountId = req.params.accountId;
    const account = await Account.findById(accountId);
    if (!account) {
      return res.status(404).json({ error: "Account not found" });
    }
    res.json(account);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    console.log(error);
  }
});

// Deletes account
app.delete("/api/accounts/:accountId", async (req, res) => {
  try {
    const accountId = req.params.accountId;
    const deletedAccount = await Account.findByIdAndDelete(accountId);
    if (!deletedAccount) {
      return res.status(404).json({ error: "Account not found" });
    }
    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Updates Account
app.put("/api/accounts/:accountId", async (req, res) => {
  try {
    const accountId = req.params.accountId;
    const {
      accountNumber,
      firstName,
      lastName,
      email,
      password,
      dailyWithdrawalLimit,
    } = req.body;
    const updatedAccount = await Account.findByIdAndUpdate(
      accountId,
      { accountNumber, firstName, lastName, dailyWithdrawalLimit },
      { new: true }
    );
    if (!updatedAccount) {
      return res.status(404).json({ error: "Account not found" });
    }
    res.json(updatedAccount);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Fetches all transactions for an account
// app.get('/api/accounts/:accountId/transactions', async (req, res) => {
//   try {
//     const accountId = req.params.accountId;

//     const account = await Account.findById(accountId).populate("transactions");
//         if (!account) {
//             return res.status(404).json({ error: 'Account not found' });
//         }

//     const transactions = account.transactions;
//     res.status(200).json({transactions});
//   }catch (error) {
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// Fetches all transactions for an account




app.get("/api/accounts/:accountNumber/transactions", async (req, res) => {
  try {
    const { accountNumber } = req.params;

    // Find the account by account number
    const account = await Account.findOne({ accountNumber }).populate('transactions');
    if (!account) {
      return res.status(404).json({ error: "Account not found" });
    }

    const transactions = account.transactions;
    res.status(200).json({ transactions });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// app.get("/api/accounts/:accountId/transactions", async (req, res) => {
//   try {
//     const { accountId } = req.params;

//     // Validate the accountId parameter
//     if (!mongoose.Types.ObjectId.isValid(accountId)) {
//       return res.status(400).json({ error: "Invalid account ID" });
//     }

//     const account = await Account.findById(accountId).populate("transactions");
//     if (!account) {
//       return res.status(404).json({ error: "Account not found" });
//     }

    

//     const transactions = account.transactions;
//     res.status(200).json({ transactions });
//   } catch (error) {
//     console.error("Error fetching transactions:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// Daily Withdrawal limit
app.post('/api/accounts/:accountId/withdrawals', async (req, res) => {
  try {
    const accountId = req.params.accountId;
    const withdrawalAmount = req.body.amount;
    const password = req.body.password;

    if (withdrawalAmount === undefined || withdrawalAmount <= 0) {
      return res.status(400).json({ error: 'Invalid withdrawal amount' });
    }

    const account = await Account.findById(accountId);
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, account.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Check if we need to reset the withdrawal amount
    const today = new Date();
    const isSameDay = account.lastWithdrawalDate && account.lastWithdrawalDate.toDateString() === today.toDateString();

    if (!isSameDay) {
      account.withdrawalAmountToday = 0;
    }

    if ((account.withdrawalAmountToday + withdrawalAmount) > account.dailyWithdrawalLimit) {
      return res.status(400).json({ error: 'Exceeds daily withdrawal limit' });
    }

    // Update account balance and withdrawal amount for the day
    account.balance -= withdrawalAmount;
    account.withdrawalAmountToday += withdrawalAmount;
    account.lastWithdrawalDate = today;
    await account.save();

    // Record transaction
    const transaction = new Transaction({
      type: 'Withdrawal',
      amount: -withdrawalAmount,
      account: accountId,
    });
    await transaction.save();

    res.status(200).json({ message: 'Withdrawal successful', balance: account.balance });

  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
    console.error(error);
  }
});

// This is just a new route to set daily withdraw limitations for a single account
app.put("/api/accounts/:accountId/daily-withdrawal-limit", async (req, res) => {
  try {
    const accountId = req.params.accountId;
    const limit = req.body.dailyWithdrawalLimit;

    const account = await Account.findByIdAndUpdate(
      accountId,
      { dailyWithdrawalLimit: limit },
      { new: true }
    );
    if (!account) {
      return res.status(404).json({ error: "Account not found" });
    }

    res.json({ message: "Daily withdrawal limit updated", account: account });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Withdrawal API
app.post('/api/accounts/withdrawals', async (req, res) => {
  try {
    const { accountNumber, amount, password } = req.body;

    if (amount === undefined || amount <= 0) {
      return res.status(400).json({ error: 'Invalid withdrawal amount' });
    }

    // Find the account by account number
    const account = await Account.findOne({ accountNumber });
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, account.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Check if we need to reset the withdrawal amount
    const today = new Date();
    const isSameDay = account.lastWithdrawalDate && account.lastWithdrawalDate.toDateString() === today.toDateString();

    if (!isSameDay) {
      account.withdrawalAmountToday = 0;
    }

    if ((account.withdrawalAmountToday + amount) > account.dailyWithdrawalLimit) {
      return res.status(400).json({ error: 'Exceeds daily withdrawal limit' });
    }

    // Update account balance and withdrawal amount for the day
    account.balance -= amount;
    account.withdrawalAmountToday += amount;
    account.lastWithdrawalDate = today;
    await account.save();

    // Record transaction
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

//Deposit API
app.post("/api/accounts/:accountId/deposit", async (req, res) => {
  try {
    const accountId = req.params.accountId;
    const depositAmount = req.body.amount;
    const password = req.body.password;

    // Validate deposit amount
    if (!depositAmount || depositAmount <= 0) {
      return res.status(400).json({ error: "Invalid deposit amount" });
    }

    // Fetch account details
    const account = await Account.findById(accountId);
    if (!account) {
      return res.status(404).json({ error: "Account not found" });
    }

    // Update account balance
    account.balance += depositAmount;
    await account.save();

    // Record transaction
    const transaction = new Transaction({
      type: "Deposit",
      amount: depositAmount,
      account: accountId,
    });
    await transaction.save();

    res
      .status(200)
      .json({ message: "Deposit successful", balance: account.balance });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/accounts/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: "email and password is required",
    });
  }

  const user = await Account.findOne({ email }).catch((err) => {
    res.status(400).json({
      error: err.message,
    });
  });

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(400).json({
      error: "Incorrect password",
    });
  }
});
