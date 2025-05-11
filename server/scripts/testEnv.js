const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

console.log('Current working directory:', process.cwd());

// Load environment variables from different possible locations
const envPaths = [
  path.resolve(__dirname, '../.env'),
  path.resolve(__dirname, '../../.env'),
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), 'server/.env')
];

for (const envPath of envPaths) {
  console.log(`Checking for .env at: ${envPath}`);
  
  try {
    if (fs.existsSync(envPath)) {
      console.log(`File exists at ${envPath}`);
      dotenv.config({ path: envPath });
      console.log(`Loaded env from ${envPath}`);
    } else {
      console.log(`No .env file found at ${envPath}`);
    }
  } catch (err) {
    console.error(`Error checking ${envPath}:`, err);
  }
}

// Print environment variables
console.log('\nEnvironment variables:');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? `✓ Set (${process.env.JWT_SECRET.slice(0, 3)}...)` : '✗ Not set');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? `✓ Set (${process.env.MONGODB_URI})` : '✗ Not set');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT); 