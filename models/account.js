const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
  {
    accountNumber: { type: Number, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    balance: { type: Number, default: 0 },
    dailyWithdrawalLimit: { type: Number, default: 1000 },
    withdrawalAmountToday: { type: Number, default: 0 },
    transactions: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Transaction" },
    ],
  },
  {
    timestamps: true,
  }
);

// const Account = mongoose.model('Account', accountSchema);
// module.exports = Account;

module.exports = mongoose.model("Account", accountSchema);
