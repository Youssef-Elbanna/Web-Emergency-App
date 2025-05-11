const jwt = require('jsonwebtoken');
const fs = require('fs');

// Set JWT secret directly
const JWT_SECRET = 'supersecretkey123';

try {
  // Try to generate a token
  const token = jwt.sign({ id: '12345' }, JWT_SECRET, { expiresIn: '30d' });
  console.log('Successfully generated JWT token:', token);
} catch (error) {
  console.error('Error generating JWT token:', error);
}

// Create or update the .env file to make sure it has the right format
const envContent = `PORT=5000
MONGODB_URI=mongodb://localhost:27017/med_emergency_db
JWT_SECRET=supersecretkey123
NODE_ENV=development
`;

fs.writeFileSync('server/.env', envContent);
console.log('.env file updated successfully'); 