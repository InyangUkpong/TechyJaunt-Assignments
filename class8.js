// Class 8 Assignment - TechyJaunt 


//Bank Simulation App Enhanced

class BankAccount {
  constructor(accountNumber, firstName, lastName, dailyWithdrawalLimit) {
      this.__accountNumber = accountNumber;
      this.__firstName = firstName;
      this.__lastName = lastName;
      this.__accountHolder = `${firstName} ${lastName}`;
      this.__balance = 0;
      this.__transactions = [];
      this.__dailyWithdrawalLimit = dailyWithdrawalLimit || 1000; // Default daily withdrawal limit
      this.__withdrawalAmountToday = 0;
  }

  deposit(amount) {
      if (amount > 0) {
          this.__balance += amount;
          this.__transactions.push({ type: "Deposit", amount, timestamp: new Date() });
          return true;
      } else {
          return false;
      }
  }

  withdraw(amount) {
      if (amount > 0 && (this.__withdrawalAmountToday + amount) <= this.__dailyWithdrawalLimit && amount <= this.__balance) {
          this.__balance -= amount;
          this.__transactions.push({ type: "Withdrawal", amount: -amount, timestamp: new Date() });
          this.__withdrawalAmountToday += amount;
          return true;
      } else {
          return false;
      }
  }

  transfer(amount, recipientAccount) {
      if (amount > 0 && amount <= this.__balance && (this.__withdrawalAmountToday + amount) <= this.__dailyWithdrawalLimit) {
          this.__balance -= amount;
          recipientAccount.deposit(amount);
          this.__transactions.push({ type: "Transfer (-)", amount: -amount, timestamp: new Date() });
          recipientAccount.__transactions.push({ type: "Transfer (+)", amount, timestamp: new Date() });
          this.__withdrawalAmountToday += amount;
          return true;
      } else {
          return false;
      }
  }

  getTransactions() {
      return this.__transactions;
  }

  // Getters for private attributes
  getAccountNumber() {
      return this.__accountNumber;
  }

  getFirstName() {
      return this.__firstName;
  }

  getLastName() {
      return this.__lastName;
  }

  getAccountHolder() {
      return this.__accountHolder;
  }

  getBalance() {
      return this.__balance;
  }

  getDailyWithdrawalLimit() {
      return this.__dailyWithdrawalLimit;
  }

  getWithdrawalAmountToday() {
      return this.__withdrawalAmountToday;
  }
}

// Example usage
const account1 = new BankAccount(123456789, "John", "Doe", 2000);
const account2 = new BankAccount(987654321, "Jane", "Smith", 1500);

account1.deposit(1000);
account2.deposit(1500);

account1.transfer(500, account2);
console.log("Account 1 Balance:", account1.getBalance());
console.log("Account 2 Balance:", account2.getBalance());

console.log("Account 1 Transactions:");
console.log(account1.getTransactions());

console.log("Account 2 Transactions:");
console.log(account2.getTransactions());




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
//       if (amount > 0 && amount <= this._balance) {  // if the amount to withdraw is greater than 0 and less than or equel to the current balanace
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
  