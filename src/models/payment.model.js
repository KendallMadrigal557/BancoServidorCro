const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    cardNumber: { type: String, required: true },
    expirationDate: { type: Date, required: true },
    securityCode: { type: String, required: true },
    amount: { type: Number, required: true },
    paymentDate: { type: Date, default: Date.now }
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
