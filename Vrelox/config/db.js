const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Aapki exact username, password aur database link ke sath complete connection string
        const dbURI = 'mongodb+srv://leeonestore_db_user:9N9Gsabw262JKla3@leeon.fltstha.mongodb.net/vreloxDB?retryWrites=true&w=majority&appName=Leeon';
        
        await mongoose.connect(dbURI);
        console.log('MongoDB Cloud (Atlas) Connected Successfully...');
    } catch (err) {
        console.error('Database Connection Failed:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;