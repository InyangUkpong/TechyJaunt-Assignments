
// Fixes


const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const accountSchema = new mongoose.Schema({
  accountNumber: {
    type: Number,
    unique: true,
    required: true,
    select: false
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  dailyWithdrawalLimit: {
    type: Number,
    required: true,
    default: 500,
    select: false
  },
  withdrawalAmountToday: { 
    type: Number,
    default: 0,
    select: false
  },
  lastWithdrawalDate: {
    type: Date,
  },
  balance: {
    type: Number,
    default: 0,
    select: false
  },
  transactions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;


// const accountSchema = new mongoose.Schema({
//   balance: Number,
//   withdrawalAmountToday: Number,
//   dailyWithdrawalLimit: Number,
//   password: String,
//   transactions: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Transaction'
//   }]
// });

// const Account = mongoose.model('Account', accountSchema);
// module.exports = Account;



