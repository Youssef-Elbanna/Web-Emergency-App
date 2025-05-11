const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from different possible locations
const envPaths = [
  path.resolve(__dirname, '../.env'),
  path.resolve(__dirname, '../../.env'),
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), 'server/.env')
];

for (const envPath of envPaths) {
  console.log('Trying to load .env from:', envPath);
  dotenv.config({ path: envPath });
  if (process.env.MONGODB_URI) {
    console.log('Found MONGODB_URI in:', envPath);
    break;
  }
}

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/med_emergency_db')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

const userSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  phone: String,
  password: String,
  address: String,
  emergencyContact: String,
  medicalConditions: String,
  bloodType: String,
  role: String,
  createdAt: Date,
  updatedAt: Date
});

const User = mongoose.model('User', userSchema);

async function main() {
  try {
    const email = 't@t.com';
    
    // Find the user
    const user = await User.findOne({ email });
    
    if (user) {
      console.log('User found:');
      console.log('ID:', user._id);
      console.log('Name:', user.fullName);
      console.log('Email:', user.email);
      console.log('Created at:', user.createdAt);
      
      // Delete the user if the delete argument is provided
      if (process.argv.includes('--delete')) {
        await User.deleteOne({ email });
        console.log(`User with email ${email} has been deleted.`);
      } else {
        console.log('To delete this user, run the script with --delete argument');
      }
    } else {
      console.log(`No user found with email ${email}`);
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
    console.log('Database connection closed');
  }
}

main(); 