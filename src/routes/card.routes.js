const express = require('express');
const router = express.Router();
const cors = require('cors');
const creditCardController = require('../controllers/card.controller');


router.use(cors());

router.post('/credit-cards', creditCardController.createCreditCard);
router.get('/credit-cards', creditCardController.getAllCreditCards);
router.get('/credit-cards/:id', creditCardController.getCreditCardById);
router.put('/credit-cards/:id', creditCardController.updateCreditCard);
router.delete('/credit-cards/:id', creditCardController.deleteCreditCard);

module.exports = router;
