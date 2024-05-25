const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  type: String,
  amount: Number,
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account'
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;



// Initial CODE
// const mongoose = require('mongoose');

// const transactionSchema = new mongoose.Schema({
//   amount: {
//     type: Number,
//     required: true
//   },
//   date: {
//     type: Date,
//     default: Date.now
//   },
//   account: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Account',
//     required: true
//   }
// });

// const Transaction = mongoose.model('Transaction', transactionSchema);

// module.exports = Transaction;








