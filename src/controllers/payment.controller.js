const Payment = require('../models/payment.model');
const CreditCard = require('../models/card.model');

async function createPayment(req, res) {
    try {
        const { cardNumber, expirationDate, securityCode, amount } = req.body;

        const creditCard = await CreditCard.findOne({ cardNumber });

        if (!creditCard) {
            return res.status(404).json({ message: 'Tarjeta de crédito no encontrada' });
        }

        if (creditCard.cardBalance < amount) {
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

        res.status(201).json(savedPayment);
    } catch (error) {
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
