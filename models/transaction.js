const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
    {
    type: { type: String, required: true },
    amount: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
    account: { type: mongoose.Schema.Types.ObjectId, ref: "Account" },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Transaction", transactionSchema);
