const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');
const Product = require('../models/Product');

router.post('/', async (req,res) => {
  try{
    const { productId, quantitySold } = req.body;
    const product = await Product.findById(productId);
    if(!product) return res.status(404).json({ error: 'Product not found' });
    if(product.quantity < quantitySold) return res.status(400).json({ error: 'Insufficient stock' });
    product.quantity -= quantitySold;
    await product.save();
    const sale = new Sale({ productId, quantitySold });
    await sale.save();
    res.status(201).json(sale);
  }catch(err){ res.status(500).json({ error: err.message }); }
});

router.get('/', async (req,res) => {
  try{
    const sales = await Sale.find().populate('productId', 'name sku');
    res.json(sales);
  }catch(err){ res.status(500).json({ error: err.message }); }
});

module.exports = router;
