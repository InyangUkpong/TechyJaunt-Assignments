// Class 8 Assignment - TechyJaunt 

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
    constructor(accountNumber, firstName, lastName) {
      this._accountNumber = accountNumber;
      this._firstName = firstName;
      this._lastName = lastName;
      this._accountHolder = `${firstName} ${lastName}`;
      this._balance = 0;
      this._transactions = [];
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
  
    get transactions() {
      return this._transactions;
    }
  
    // Methods
    deposit(amount) {
      if (amount > 0) {
        this._balance += amount;
        this._transactions.push(new Transaction('deposit', amount));
      } else {
        console.log("Invalid deposit amount.");
      }
    }
  
    withdraw(amount) {
      if (amount > 0 && amount <= this._balance) {  // if the amounts to withdraw is greater than 0 and less than or equel to the current balanace
        this._balance -= amount;                    // subtract the amount from the balance
        this._transactions.push(new Transaction('withdraw', amount));  // method creates an object with type withdrawal and amount and adds to the list of transactions
      } else {                                                         // otherwise
        console.log("Invalid withdrawal amount you have insufficient funds.");  // log out the message invalid withdrawal amount or insufficient funds
      }
    }
  
    getTransactions() {
      return this._transactions;
    }
  }
  
  // Example usage:
  const account = new BankAccount(123456789, "Inyang", "Ukpong");
  console.log(account.accountHolder); // Inyang Ukpong
  console.log(account.balance); // 
  
  account.deposit(100);
  account.withdraw(50);
  console.log(account.balance); // 50
  
  console.log(account.getTransactions()); // Array of Transaction objects
  