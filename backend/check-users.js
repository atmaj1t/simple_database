const mongoose = require('mongoose');
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/login-app', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(async () => {
    console.log('Connected to MongoDB');
    
    try {
        // Get all users
        const users = await User.find().select('-password');
        
        console.log('\nRegistered Users:');
        console.log('-----------------');
        
        if (users.length === 0) {
            console.log('No users found in the database.');
        } else {
            users.forEach((user, index) => {
                console.log(`\nUser ${index + 1}:`);
                console.log(`Username: ${user.username}`);
                console.log(`Email: ${user.email}`);
                console.log(`Created At: ${user.createdAt}`);
                console.log('-----------------');
            });
        }
    } catch (error) {
        console.error('Error fetching users:', error);
    } finally {
        // Close the connection
        mongoose.connection.close();
    }
})
.catch(err => {
    console.error('MongoDB connection error:', err);
}); 