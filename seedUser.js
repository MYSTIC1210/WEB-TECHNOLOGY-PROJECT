const connectDB = require('./db');
const User = require('./models/User');
require('dotenv').config();

(async () => {
  try {
    await connectDB(process.env.MONGODB_URI);
    const adminUser = process.env.ADMIN_USER || 'admin';
    const adminPass = process.env.ADMIN_PASS || 'password';
    let user = await User.findOne({ username: adminUser });
    if (!user) {
      user = await User.create({ username: adminUser, password: adminPass, role: 'admin' });
      console.log('Admin user created:', adminUser);
    } else {
      console.log('Admin user already exists:', adminUser);
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();