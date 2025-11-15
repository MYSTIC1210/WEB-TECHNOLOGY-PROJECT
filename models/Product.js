const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: String, unique: true, sparse: true },
  category: { type: String, default: 'General' },
  quantity: { type: Number, default: 0 },
  minStock: { type: Number, default: 10 },
  price: { type: Number, default: 0 },
  supplier: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

productSchema.pre('save', function(next){
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Product', productSchema);
