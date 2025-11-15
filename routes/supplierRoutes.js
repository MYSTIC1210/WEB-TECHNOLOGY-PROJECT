const express = require('express');
const router = express.Router();
const Supplier = require('../models/Supplier');

router.get('/', async (req,res) => {
  try{
    const s = await Supplier.find().sort({ name: 1 });
    res.json(s);
  }catch(err){ res.status(500).json({ error: err.message }); }
});

router.post('/', async (req,res) => {
  try{
    const s = new Supplier(req.body);
    await s.save();
    res.status(201).json(s);
  }catch(err){ res.status(400).json({ error: err.message }); }
});

module.exports = router;
