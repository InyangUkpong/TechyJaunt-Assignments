const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const router = express.Router();
// const Account = require('./models/account.models.js');
const Transaction = require('./models/transaction.js');
const Account = require('./models/account.js');
const transactionRoutes = require("./routes/transactionRoutes");
const accountRoutes = require("./routes/accountRoutes");

const app = express();
const port = 3000
app.use(bodyParser.json());
app.use(transactionRoutes);
// Include account routes
app.use(accountRoutes);
app.use(transactionRoutes);

dotenv.config();


// Connecting to db through TablePlus 
const dbUri = "mongodb://localhost:27017/assignment4"
mongoose.connect(dbUri)
 .then(() => {
    console.log("Connected to MongoDB");
  }).catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

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



app.get('/', (req, res) => {
    res.send('Hello from Node API Server')
});


// **************************
// I am defining Api Routes and Controller Here

// Fetch all accounts
app.get('/api/accounts/getall', async (req, res) => {
    try {
      const accounts = await Account.find();
      res.json(accounts);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Create Account
  app.post('/api/accounts', async (req, res) => {
    try {
      const { accountNumber, firstName, lastName, dailyWithdrawalLimit } = req.body;
      const newAccount = await Account.create({ accountNumber, firstName, lastName, dailyWithdrawalLimit });
      res.status(201).json(newAccount);
    } catch (error) {
      res.status(500).json({ error: error.message });
      console.log(error);
    }
  });
  
  // Fetch single account
  app.get('/api/accounts/:accountId', async (req, res) => {
    try {
      const accountId = req.params.accountId;
      const account = await Account.findById(accountId);
      if (!account) {
        return res.status(404).json({ error: 'Account not found' });
      }
      res.json(account);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
      console.log(error);
    }
  });

// Deletes account
app.delete('/api/accounts/:accountId', async (req, res) => {
  try {
    const accountId = req.params.accountId;
    const deletedAccount = await Account.findByIdAndDelete(accountId);
    if (!deletedAccount) {
      return res.status(404).json({ error: 'Account not found' });
    }
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Updates Account
app.put('/api/accounts/:accountId', async (req, res) => {
  try {
    const accountId = req.params.accountId;
    const { accountNumber, firstName, lastName, dailyWithdrawalLimit } = req.body;
    const updatedAccount = await Account.findByIdAndUpdate(accountId, { accountNumber, firstName, lastName, dailyWithdrawalLimit }, { new: true });
    if (!updatedAccount) {
      return res.status(404).json({ error: 'Account not found' });
    }
    res.json(updatedAccount);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Fetches all transactions for an account
app.get('/api/accounts/:accountId/transactions', async (req, res) => {
  try {
        const accountId = req.params.accountId;
        

        const account = await Account.findById(accountId);
        if (!account) {
            return res.status(404).json({ error: 'Account not found' });
        }
    
        const transactions = account.transactions;
    res.status(200).json({transactions});
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});



// Create transaction


// Fetch single transaction




// Daily Withdrawal limit
app.post('/api/accounts/:accountId/withdrawal', async (req, res) => {
    try {
        const accountId = req.params.accountId;
        const amount = req.body.amount;

        const account = await Account.findById(accountId);
        if (!account) {
            return res.status(404).json({ error: 'Account not found' });
        }

        const today = new Date().toDateString();
        if (account.lastWithdrawalDate !== today) {
            // Reset daily withdrawal amount if it's a new day
            account.lastWithdrawalDate = today;
            account.dailyWithdrawalAmount = 0;
        }

        if (amount <= 0) {
            return res.status(400).json({ error: 'Invalid withdrawal amount' });
        }

        if (amount > account.balance) {
            return res.status(400).json({ error: 'Insufficient funds' });
        }

        if (amount > account.dailyWithdrawalLimit || (account.dailyWithdrawalAmount + amount) > account.dailyWithdrawalLimit) {
            return res.status(400).json({ error: 'Exceeds daily withdrawal limit' });
        }

        // If all conditions are met, perform withdrawal
        account.balance -= amount;
        account.transactions.push({
            type: 'withdrawal',
            amount: amount,
            timestamp: new Date()
        });
        account.dailyWithdrawalAmount += amount;

        // Save the updated account
        await account.save();

        res.json({ message: 'Withdrawal successful', account: account });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// This is just a new route to set daily withdraw limitations for a single account
app.put('/api/accounts/:accountId/daily-withdrawal-limit', async (req, res) => {
    try {
        const accountId = req.params.accountId;
        const limit = req.body.dailyWithdrawalLimit;

        const account = await Account.findByIdAndUpdate(accountId, { dailyWithdrawalLimit: limit }, { new: true });
        if (!account) {
            return res.status(404).json({ error: 'Account not found' });
        }

        res.json({ message: 'Daily withdrawal limit updated', account: account });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Withdrawal API
app.post('/api/accounts/:accountId/withdrawals', async (req, res) => {
  try {
        const accountId = req.params.accountId;
        const withdrawalAmount = req.body.amount;

        if (withdrawalAmount === undefined || withdrawalAmount <= 0) {
            return res.status(400).json({ error: 'Invalid withdrawal amount' });
        }
        // Withdrawal logic goes here
        const account = await Account.findById(accountId);
        if (!account) {
            return res.status(404).json({ error: 'Account not found' });
        }

        if((account.withdrawalAmountToday + withdrawalAmount)>account.dailyWithdrawalLimit){
            return res.status(400).json({ error: 'Exceeds daily withdrawal limit' 
        });
        }
        // Update account balance and withdrawal amount for the day
        account.balance -= withdrawalAmount;
        account.withdrawalAmountToday += withdrawalAmount;
        await account.save();

        // Record transaction
        const transaction = new Transaction({
            type: "Withdrawal",
            amount: -withdrawalAmount,
            account: accountId
        });
        await transaction.save();

        res.status(200).json({ message: "Withdrawal successful", balance: account.balance });

    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
        console.log(error);
    }
        
  
});


//Deposit API
app.post('/api/accounts/:accountId/deposit', async (req, res) => {
    try {
        const accountId = req.params.accountId;
        const depositAmount = req.body.amount;

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
            account: accountId
        });
        await transaction.save();

        res.status(200).json({ message: "Deposit successful", balance: account.balance });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});






//BoilerPlate
// app.get('/accounts', (req, res) => {
//     res.send('Hello World!')
// });

// app.get('/api/transactions', (req, res) => {
//     res.send('Hello World!')
// });

// app.post('/api/accounts', async (req, res) => {
//     try {
//         const account = await Account.create(req.body);
//         res.status(200).json({ message: "Account created successfully", account });

//     }catch (err) {
//         res.status(500).json({ error: error.message });
//     }
// });

// app.post('/transactions', (req, res) => {
//     res.send('Hello World!')
// });

// app.delete('/accounts', (req, res) => {
//     res.send('Hello World!')
// });

// app.delete('/transactions', (req, res) => {
//     res.send('Hello World!')
// });

// app.put('/accounts', (req, res) => {
//     res.send('Hello World!')
// });

// app.put('/transactions', (req, res) => {
//     res.send('Hello World!')
// });

// app.patch('/accounts', (req, res) => {
//     res.send('Hello World!')
// });

// app.patch('/transactions', (req, res) => {
//     res.send('Hello World!')
// });

// Deposit

// app.post('/api/accounts/:accountId/deposit', async (req, res) => {
//     try {
      // Deposit logic goes here
//     } catch (error) {
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   });  








//Exprimental codes
// Connect to MongoDB
// mongoose.connect(process.env.MONGODB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })
// .then(() => {
//     console.log("Connected to MongoDB");
// }).catch((err) => {
//     console.error("Error connecting to MongoDB", err);
// });

// Routes
// const accountRoutes = require('./routes/accountRoutes');
// const transactionRoutes = require('./routes/transactionRoutes');

// app.use('/api/accounts', accountRoutes);
// app.use('/api/transactions', transactionRoutes);


//Experiments*********

// Withdrawal API 
// app.post('/api/accounts/:accountId/withdrawal', async (req, res) => {
//     try {
//         const accountId = req.params.accountId;
//         const withdrawalAmount = req.body.amount;

        // Validate withdrawal amount
//         if (!withdrawalAmount || withdrawalAmount <= 0) {
//             return res.status(400).json({ error: "Invalid withdrawal amount" });
//         }

        // Fetch account details
//         const account = await Account.findById(accountId);
//         if (!account) {
//             return res.status(404).json({ error: "Account not found" });
//         }

        // Check if withdrawal amount exceeds daily limit
//         if ((account.withdrawalAmountToday + withdrawalAmount) > account.dailyWithdrawalLimit) {
//             return res.status(400).json({ error: "Withdrawal amount exceeds daily limit" });
//         }

        // Check if withdrawal amount exceeds balance
//         if (withdrawalAmount > account.balance) {
//             return res.status(400).json({ error: "Insufficient balance" });
//         }

        // Update account balance and withdrawal amount for the day
//         account.balance -= withdrawalAmount;
//         account.withdrawalAmountToday += withdrawalAmount;
//         await account.save();

        // Record transaction
//         const transaction = new Transaction({
//             type: "Withdrawal",
//             amount: -withdrawalAmount,
//             account: accountId
//         });
//         await transaction.save();

//         res.status(200).json({ message: "Withdrawal successful", balance: account.balance });
//     } catch (error) {
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });
