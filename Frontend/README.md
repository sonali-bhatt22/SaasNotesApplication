# SaaS Notes Frontend

This frontend automatically handles token management - no need to manually add headers!

## Features

✅ **Automatic Token Management** - Tokens are automatically stored and included in all API requests  
✅ **Auto-Login** - Remembers your login session  
✅ **Auto-Logout** - Automatically logs out when token expires  
✅ **Full CRUD Operations** - Create, read, update, and delete notes  
✅ **Modern UI** - Clean and responsive interface  

## Setup Instructions

### 1. Install Dependencies
```bash
cd Frontend
npm install
```

### 2. Start the Frontend
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### 3. Set API URL for production
On Vercel project settings, add:

- `VITE_API_URL` = https://your-backend.vercel.app

For local dev, proxy is used automatically.

## How It Works

1. **Login** - Enter your credentials (tokens are automatically stored)
2. **Automatic Headers** - All API requests automatically include the Authorization header
3. **Token Refresh** - If token expires, you're automatically redirected to login
4. **Persistent Session** - Your login persists across browser refreshes

## Test Accounts

- `admin@acme.test` / `password`
- `user@acme.test` / `password`
- `admin@globex.test` / `password`
- `user@globex.test` / `password`

## No More Manual Headers!

The frontend automatically:
- Stores your login token in localStorage
- Adds `Authorization: Bearer <token>` to every API request
- Handles token expiration
- Manages your session state

Just login once and everything works automatically! 🎉
