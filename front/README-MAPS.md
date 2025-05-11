# Setting Up Google Maps in MedEmergency App

The RequestAmbulance page requires Google Maps to function properly. Follow these instructions to set up your Google Maps API key and fix the "Oops! Something went wrong" error.

## Getting a Google Maps API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Places API (optional, for autocomplete features)
4. Create credentials to get your API key
   - Navigate to "Credentials" in the left sidebar
   - Click "Create Credentials" → "API Key"
   - Copy your new API key

## Adding the API Key to Your Application

1. Open the `.env` file in the `web` directory
2. Replace `YOUR_GOOGLE_MAPS_API_KEY_HERE` with your actual API key:
   ```
   VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key_goes_here
   ```
3. Save the file
4. Restart your development server:
   ```
   npm run dev
   ```

## Restricting Your API Key (Recommended)

For security reasons, it's recommended to restrict your API key:

1. In Google Cloud Console, go to "Credentials"
2. Click on your API key
3. Under "Application restrictions", choose "HTTP referrers"
4. Add your domains (for development: `localhost`, `127.0.0.1`)
5. Under "API restrictions", restrict the key to only the Maps JavaScript API and Places API

## Troubleshooting

If you still see the "Oops! Something went wrong" error:

1. Check the browser console for specific error messages
2. Verify that your API key is correctly set in the `.env` file
3. Make sure you've enabled the Maps JavaScript API in your Google Cloud Console
4. Check if your API key has any billing issues or quota limitations
5. Clear your browser cache and try again

For local development, your API key should work without billing information, but for production use, you'll need to set up billing in the Google Cloud Console. 