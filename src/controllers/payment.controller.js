const Payment = require('../models/payment.model');
const CreditCard = require('../models/card.model');
const moment = require('moment');


function validateCard(card) {
    const currentDate = new Date();
    const expirationDate = new Date(card.expirationDate);
    console.log('Received card data:', card);
    console.log('Current date:', currentDate.toISOString());
    console.log('Expiration date:', expirationDate.toISOString());

    if (!card.securityCode || card.securityCode.toString().length !== 3) {
        console.log('Invalid security code');
        return false;
    }

    if (
        isNaN(expirationDate) ||
        expirationDate < currentDate ||
        expirationDate.getUTCFullYear() < currentDate.getUTCFullYear() || // Check if year is less than current year
        (expirationDate.getUTCFullYear() === currentDate.getUTCFullYear() && expirationDate.getUTCMonth() < currentDate.getUTCMonth()) // Check if month is less than current month
    ) {
        console.log('Invalid expiration date');
        return false;
    }

    return true;
}



async function createPayment(req, res) {
    try {
        console.log('createPayment function called');
        let { cardNumber, expirationDate, securityCode, amount } = req.body;
        console.log('Received payment data:', req.body);

        const isValidCard = validateCard({ expirationDate, securityCode });
        console.log('isValidCard:', isValidCard);

        if (!isValidCard) {
            return res.status(400).json({ message: 'Tarjeta de crédito inválida' });
        }

        let creditCard;
        try {
            creditCard = await CreditCard.findOne({ cardNumber: cardNumber });
            console.log('Result of findOne query:', creditCard);
        } catch (error) {
            console.error('Error in findOne query:', error);
            return res.status(500).json({ error: 'Error querying the database' });
        }

        console.log('Found credit card:', creditCard);

        if (!creditCard) {
            console.log(1)
            return res.status(404).json({ message: 'Tarjeta de crédito no encontrada' });
        }

        if (creditCard.cardBalance < amount) {
            console.log(2)
            return res.status(400).json({ message: 'Fondos insuficientes en la tarjeta de crédito' });
        }

        creditCard.cardBalance -= amount;
        await creditCard.save();

        const newPayment = new Payment({
            cardNumber,
            expirationDate,
            securityCode,
            amount
        });
        const savedPayment = await newPayment.save();
        console.log('New payment saved:', savedPayment);

        res.status(201).json(savedPayment);
    } catch (error) {
        console.error('Error creating payment:', error.message);
        res.status(500).json({ error: error.message });
    }
}




async function getAllPayments(req, res) {
    try {
        const payments = await Payment.find();
        res.json(payments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getPaymentById(req, res) {
    try {
        const { id } = req.params;
        const payment = await Payment.findById(id);

        if (!payment) {
            return res.status(404).json({ message: 'Pago no encontrado' });
        }

        res.json(payment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function updatePayment(req, res) {
    try {
        const { id } = req.params;
        const { cardNumber, expirationDate, securityCode, amount } = req.body;

        const updatedPayment = await Payment.findByIdAndUpdate(
            id,
            { cardNumber, expirationDate, securityCode, amount },
            { new: true }
        );

        if (!updatedPayment) {
            return res.status(404).json({ message: 'Pago no encontrado' });
        }

        res.json(updatedPayment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function deletePayment(req, res) {
    try {
        const { id } = req.params;

        const deletedPayment = await Payment.findByIdAndDelete(id);

        if (!deletedPayment) {
            return res.status(404).json({ message: 'Pago no encontrado' });
        }

        res.json({ message: 'Pago eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    createPayment,
    getAllPayments,
    getPaymentById,
    updatePayment,
    deletePayment
};
