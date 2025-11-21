# 🔥 Firebase Setup Instructions

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter project name: **UNO Multiplayer**
4. Disable Google Analytics (optional)
5. Click **"Create project"**

## Step 2: Register Web App

1. In your Firebase project, click the **Web icon** (</>)
2. Register app name: **UNO Game**
3. **DO NOT** check "Firebase Hosting" (we're using Vercel)
4. Click **"Register app"**
5. **COPY** the Firebase configuration object

## Step 3: Enable Realtime Database

1. In Firebase Console, go to **"Build" → "Realtime Database"**
2. Click **"Create Database"**
3. Choose location closest to your users
4. Select **"Start in test mode"** (for development)
5. Click **"Enable"**

## Step 4: Configure Your App

1. Open `firebase-config.js` in your project
2. Replace the placeholder values with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",                    // Your API Key
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:xxxxx"
};
```

## Step 5: Set Database Rules (Optional - for production)

In Firebase Console → Realtime Database → Rules, use:

```json
{
  "rules": {
    "rooms": {
      "$roomId": {
        ".read": true,
        ".write": true,
        ".indexOn": ["createdAt"]
      }
    }
  }
}
```

## Step 6: Deploy to Vercel

Once Firebase is configured:

```bash
vercel
```

That's it! Your multiplayer UNO game is ready! 🎮

## 🔒 Security Note

The test mode rules allow anyone to read/write. For production:
1. Add authentication
2. Implement proper security rules
3. Add room password validation

## 🆘 Need Help?

If you encounter issues:
1. Check browser console for errors (F12)
2. Verify Firebase config is correct
3. Ensure Realtime Database is enabled
4. Check that database URL includes your region
