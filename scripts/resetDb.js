const mongoose = require('mongoose');
require('dotenv').config();

const resetDatabase = async () => {
  try {
    const dbURI = process.env.MONGO_URI || 'mongodb://localhost:27017/timdigital';
    
    // Connect to MongoDB
    await mongoose.connect(dbURI, {
      dbName: 'timdigital'
    });
    
    console.log('Connected to MongoDB');
    
    // Drop the database
    await mongoose.connection.dropDatabase();
    console.log('Database dropped successfully');
    
    // Close the connection
    await mongoose.connection.close();
    console.log('Connection closed');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

resetDatabase(); 