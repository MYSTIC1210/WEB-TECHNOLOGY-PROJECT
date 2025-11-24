const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Get products with optional search and category filter
router.get('/', async (req,res) => {
  try{
    const q = req.query.q || '';
    const category = req.query.category || '';
    const filter = {};
    if(q) filter.name = { $regex: q, $options: 'i' };
    if(category) filter.category = category;
    const products = await Product.find(filter).sort({ name: 1 });
    res.json(products);
  }catch(err){
    res.status(500).json({ error: err.message });
  }
});

// Create new product
router.post('/', async (req,res) => {
  try{
    const p = new Product(req.body);
    await p.save();
    res.status(201).json(p);
  }catch(err){
    res.status(400).json({ error: err.message });
  }
});

// Update product by id
router.put('/:id', async (req,res) => {
  try{
    const p = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(p);
  }catch(err){
    res.status(400).json({ error: err.message });
  }
});

// Delete product
router.delete('/:id', async (req,res) => {
  try{
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  }catch(err){
    res.status(500).json({ error: err.message });
  }
});

// Low stock
router.get('/alerts/low-stock', async (req,res) => {
  try{
    const list = await Product.find({ $expr: { $lt: ['$quantity', '$minStock'] } }).sort({ quantity: 1 });
    res.json(list);
  }catch(err){
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
