const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Sale = require('../models/Sale');

// category-wise product counts
router.get('/inventory-by-category', async (req,res) => {
  try{
    const agg = await Product.aggregate([
      { $group: { _id: '$category', totalItems: { $sum: '$quantity' }, count: { $sum: 1 } } },
      { $sort: { totalItems: -1 } }
    ]);
    res.json(agg);
  }catch(err){ res.status(500).json({ error: err.message }); }
});

// simple sales summary for date range
router.get('/sales-summary', async (req,res) => {
  try{
    const from = req.query.from ? new Date(req.query.from) : new Date(Date.now() - 30*24*60*60*1000);
    const to = req.query.to ? new Date(req.query.to) : new Date();
    const agg = await Sale.aggregate([
      { $match: { date: { $gte: from, $lte: to } } },
      { $group: { _id: '$productId', totalSold: { $sum: '$quantitySold' } } }
    ]);
    res.json(agg);
  }catch(err){ res.status(500).json({ error: err.message }); }
});

module.exports = router;
