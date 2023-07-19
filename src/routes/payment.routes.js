const express = require('express');
const router = express.Router();
const cors = require('cors');
const paymentController = require('../controllers/payment.controller');

router.use(cors());

router.post('/payments', paymentController.createPayment);
router.get('/payments', paymentController.getAllPayments);
router.get('/payments/:id', paymentController.getPaymentById);
router.put('/payments/:id', paymentController.updatePayment);

router.delete('/payments/:id', paymentController.deletePayment);

module.exports = router;
