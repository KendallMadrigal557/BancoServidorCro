const CreditCard = require('../models/card.model');

async function createCreditCard(req, res) {
    try {
        const { cardNumber, expirationDate, cardBalance, securityCode } = req.body;

        const newCreditCard = new CreditCard({
            cardNumber,
            expirationDate,
            cardBalance,
            securityCode
        });

        const savedCreditCard = await newCreditCard.save();

        res.status(201).json(savedCreditCard);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getAllCreditCards(req, res) {
    try {
        const creditCards = await CreditCard.find();
        res.json(creditCards);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getCreditCardById(req, res) {
    try {
        const { id } = req.params;
        const creditCard = await CreditCard.findById(id);

        if (!creditCard) {
            return res.status(404).json({ message: 'Tarjeta de crédito no encontrada' });
        }

        res.json(creditCard);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function updateCreditCard(req, res) {
    try {
        const { id } = req.params;
        const { cardNumber, expirationDate, cardBalance, securityCode } = req.body;

        const updatedCreditCard = await CreditCard.findByIdAndUpdate(
            id,
            { cardNumber, expirationDate, cardBalance, securityCode },
            { new: true }
        );

        if (!updatedCreditCard) {
            return res.status(404).json({ message: 'Tarjeta de crédito no encontrada' });
        }

        res.json(updatedCreditCard);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function deleteCreditCard(req, res) {
    try {
        const { id } = req.params;

        const deletedCreditCard = await CreditCard.findByIdAndDelete(id);

        if (!deletedCreditCard) {
            return res.status(404).json({ message: 'Tarjeta de crédito no encontrada' });
        }

        res.json({ message: 'Tarjeta de crédito eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    createCreditCard,
    getAllCreditCards,
    getCreditCardById,
    updateCreditCard,
    deleteCreditCard
};
