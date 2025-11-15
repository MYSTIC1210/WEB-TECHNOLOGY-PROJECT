// Simple data seeder. Run with: node seed.js
const mongoose = require('mongoose');
const connectDB = require('./db');
const Product = require('./models/Product');
const Supplier = require('./models/Supplier');

async function seed(){
  await connectDB(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/inventoryDB');
  await Product.deleteMany({});
  await Supplier.deleteMany({});

  const s1 = await Supplier.create({ name: 'Tech Supplies', contact: '9876501234', email: 'sales@tech.com' });
  const s2 = await Supplier.create({ name: 'Grocery Hub', contact: '9876505678', email: 'orders@grocery.com' });

  await Product.insertMany([
    { name: 'Laptop', sku: 'LAP-1001', category: 'Electronics', quantity: 15, minStock: 5, price: 75000, supplier: s1.name },
    { name: 'Mouse', sku: 'MOU-2001', category: 'Electronics', quantity: 45, minStock: 10, price: 499, supplier: s1.name },
    { name: 'Rice 5kg', sku: 'GRO-3001', category: 'Groceries', quantity: 30, minStock: 10, price: 399, supplier: s2.name },
    { name: 'Notebook', sku: 'ST-4001', category: 'Stationery', quantity: 5, minStock: 10, price: 49, supplier: s2.name }
  ]);

  console.log('Seeded sample data');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
