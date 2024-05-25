// const mongoose = require("mongoose");

// const accountSchema = new mongoose.Schema(
//   {
//     accountNumber: { type: Number, required: false },
//     email: { type: String, required: true },
//     password: { type: String, required: true },
//     firstName: { type: String, required: true },
//     lastName: { type: String, required: true },
//     balance: { type: Number, default: 0 },
//     dailyWithdrawalLimit: { type: Number, default: 1000 },
//     withdrawalAmountToday: { type: Number, default: 0 },
//     transactions: [
//       { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' },
//     ],
//   },
//   {
//     timestamps: true,
//   }
// );

// const Account = mongoose.model('Account', accountSchema);
// module.exports = Account;

// module.exports = mongoose.model("Account", accountSchema);


// Fixes


// const mongoose = require('mongoose');

// const accountSchema = new mongoose.Schema({
//   firstName: {
//     type: String,
//     required: true
//   },
//   lastName: {
//     type: String,
//     required: true
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   password: {
//     type: String,
//     required: true
//   },
//   dailyWithdrawalLimit: {
//     type: Number,
//   },
//   withdrawalAmountToday: { 
//     type: Number,
//   },
//   balance: {
//     type: Number,
//     default: 0
//   },
//   transactions: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Transaction'
//   }],
//   createdAt: {
//     type: Date,
//     default: Date.now
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// const Account = mongoose.model('Account', accountSchema);

// module.exports = Account;


const accountSchema = new mongoose.Schema({
  balance: Number,
  withdrawalAmountToday: Number,
  dailyWithdrawalLimit: Number,
  password: String,
  transactions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction'
  }]
});

const Account = mongoose.model('Account', accountSchema);
module.exports = Account;
