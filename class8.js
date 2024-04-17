// Assignment 8.2 - add features {Daily Withrawal Limit, trasactions should be accessed as an array of objects,
// transfer between accounts}


class Transaction {
    constructor(type, amount) {
      this.type = type; // 'deposit' or 'withdraw'
      this.amount = amount;
      this.date = new Date();
    }
  
    toString() {
      return `${this.type} of ${this.amount} at ${this.date}`;
    }
  }
  
  class BankAccount {
    constructor(accountNumber, firstName, lastName, dailyWithdrawalLimit = 500) {
      this._accountNumber = accountNumber;
      this._firstName = firstName;
      this._lastName = lastName;
      this._accountHolder = `${firstName} ${lastName}`;
      this._balance = 0;
      this._transactions = [];
      this._dailyWithdrawalLimit = dailyWithdrawalLimit;
      this._withdrawalAmountToday = 0;
    }
  
    // Getters and setters
    get accountNumber() {
      return this._accountNumber;
    }
  
    get firstName() {
      return this._firstName;
    }
  
    get lastName() {
      return this._lastName;
    }
  
    get accountHolder() {
      return this._accountHolder;
    }
  
    get balance() {
      return this._balance;
    }
  
    get dailyWithdrawalLimit() {
      return this._dailyWithdrawalLimit;
    }
  
    set dailyWithdrawalLimit(limit) {
      this._dailyWithdrawalLimit = limit;
    }
  
    // Methods
    deposit(amount) {
      if (amount > 0) {
        this._balance += amount;
        this._transactions.push({ type: 'deposit', amount, date: new Date() });
      } else {
        console.log("Invalid deposit amount.");
      }
    }
  
    withdraw(amount) {
      if (amount > 0 && amount <= this._balance && (this._withdrawalAmountToday + amount) <= this._dailyWithdrawalLimit) {
        this._balance -= amount;
        this._transactions.push({ type: 'withdraw', amount, date: new Date() });
        this._withdrawalAmountToday += amount;
      } else {
        console.log("Invalid withdrawal amount, insufficient funds, or daily withdrawal limit reached.");
      }
    }
  
    transfer(amount, targetAccount) {
      if (amount > 0 && amount <= this._balance) {
        this._balance -= amount;
        targetAccount.deposit(amount);
        this._transactions.push({ type: 'transfer', amount, date: new Date(), targetAccount: targetAccount.accountNumber });
      } else {
        console.log("Invalid transfer amount or insufficient funds.");
      }
    }
  
    getTransactions() {
      return this._transactions;
    }
  }
  
  // Example usage:
  const account1 = new BankAccount(123456789, "John", "Doe");
  const account2 = new BankAccount(987654321, "Jane", "Smith");
  
  account1.deposit(1000);
  account2.deposit(500);
  
  account1.withdraw(200);
  account2.transfer(300, account1);
  
  console.log(account1.balance); // 1100
  console.log(account2.balance); // 200
  console.log(account1.getTransactions()); // Array of transaction objects
  console.log(account2.getTransactions()); // Array of transaction objects
  





// Class 8 Assignment - TechyJaunt 


// class Transaction {
//     constructor(type, amount) {
//       this.type = type; // 'deposit' or 'withdraw'
//       this.amount = amount;
//       this.date = new Date();
//     }
  
//     toString() {
//       return `${this.type} of ${this.amount} at ${this.date}`;
//     }
//   }
  
//   class BankAccount {
//     constructor(accountNumber, firstName, lastName) {
//       this._accountNumber = accountNumber;
//       this._firstName = firstName;
//       this._lastName = lastName;
//       this._accountHolder = `${firstName} ${lastName}`;
//       this._balance = 0;
//       this._transactions = [];
//     }
  
//     // Getters and setters
//     get accountNumber() {
//       return this._accountNumber;
//     }
  
//     get firstName() {
//       return this._firstName;
//     }
  
//     get lastName() {
//       return this._lastName;
//     }
  
//     get accountHolder() {
//       return this._accountHolder;
//     }
  
//     get balance() {
//       return this._balance;
//     }
  
//     get transactions() {
//       return this._transactions;
//     }
  
//     // Methods
//     deposit(amount) {
//       if (amount > 0) {
//         this._balance += amount;
//         this._transactions.push(new Transaction('deposit', amount));
//       } else {
//         console.log("Invalid deposit amount.");
//       }
//     }
  
//     withdraw(amount) {
//       if (amount > 0 && amount <= this._balance) {  // if the amounts to withdraw is greater than 0 and less than or equel to the current balanace
//         this._balance -= amount;                    // subtract the amount from the balance
//         this._transactions.push(new Transaction('withdraw', amount));  // method creates an object with type withdrawal and amount and adds to the list of transactions
//       } else {                                                         // otherwise
//         console.log("Invalid withdrawal amount you have insufficient funds.");  // log out the message invalid withdrawal amount or insufficient funds
//       }
//     }
  
//     getTransactions() {
//       return this._transactions;
//     }
//   }
  
//   // Example usage:
//   const account = new BankAccount(123456789, "Inyang", "Ukpong");
//   console.log(account.accountHolder); // Inyang Ukpong
//   console.log(account.balance); // 
  
//   account.deposit(100);
//   account.withdraw(50);
//   console.log(account.balance); // 50
  
//   console.log(account.getTransactions()); // Array of Transaction objects
  