const mongoose = require('mongoose');

const creditCardSchema = new mongoose.Schema({
    cardNumber: { type: Number, required: true },
    expirationDate: { type: Date, required: true },
    cardBalance: { type: Number, required: true },
    securityCode: { type: String, required: true }
});

const CreditCard = mongoose.model('CreditCard', creditCardSchema);

module.exports = CreditCard;
