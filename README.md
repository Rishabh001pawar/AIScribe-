# TaskFlow - AI-Powered Note Taking App

TaskFlow is a modern note-taking application with integrated AI features to help you write, organize, and improve your notes.

## 🚀 Features

### Core Features
- ✅ Create, edit, and delete notes
- ✅ Real-time note management
- ✅ Responsive design with DaisyUI
- ✅ Rate limiting protection

### 🤖 AI-Powered Features
- **AI Chatbot**: Interactive assistant for productivity tips and note guidance
- **Note Generation**: AI-powered content creation based on topics
- **Note Improvement**: Enhance grammar, clarity, expand content, or summarize
- **Context-Aware**: AI can reference your existing notes for better assistance

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB
- OpenAI API key (for AI features)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Configuration:**
   Create a `.env` file in the backend directory with:
   ```env
   MONGO_URI=your_mongodb_connection_string
   PORT=3000
   UPSTASH_REDIS_REST_URL=your_upstash_redis_url
   UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token
   OPENAI_API_KEY=your_openai_api_key
   ```

4. **Get OpenAI API Key:**
   - Go to [OpenAI Platform](https://platform.openai.com/api-keys)
   - Create a new API key
   - Add it to your `.env` file

5. **Start the backend server:**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend/vite-project
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

### Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000

## 🤖 AI Features Guide

### Setting up AI Features

1. **Get OpenAI API Key**: Sign up at [OpenAI Platform](https://platform.openai.com/api-keys)
2. **Add to Environment**: Add `OPENAI_API_KEY=your_key_here` to backend `.env` file
3. **Restart Backend**: The AI features will be automatically available

### Using AI Features

#### AI Chatbot
- Click the robot icon in the bottom-right corner
- Ask questions about productivity, note organization, or general assistance
- The bot can reference your existing notes when you mention "notes" in your message

#### AI Note Generation
- On the Create/Edit note pages, use the "AI Writing Assistant" sidebar
- Enter a topic and choose a writing style
- Click "Generate Ideas" to create content

#### Note Improvement
- When editing an existing note, use the "Improve Note" tab
- Choose improvement type (grammar, clarity, expand, summarize)
- Click "Improve Note" to enhance your content

## 🎨 Technology Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **OpenAI API** for AI features
- **Upstash Redis** for rate limiting
- **CORS** for cross-origin requests

### Frontend
- **React 19** with Vite
- **TailwindCSS** + **DaisyUI** for styling
- **React Router** for navigation
- **Axios** for API requests
- **React Hot Toast** for notifications
- **Lucide React** for icons

## 📁 Project Structure

```
TaskFlow/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── notesController.js
│   │   │   └── chatController.js
│   │   ├── models/
│   │   │   └── Note.js
│   │   ├── routes/
│   │   │   ├── notesRoute.js
│   │   │   └── chatRoutes.js
│   │   ├── config/
│   │   │   ├── db.js
│   │   │   └── upstash.js
│   │   ├── middleware/
│   │   │   └── rateLimiter.js
│   │   └── server.js
│   ├── package.json
│   └── .env
└── frontend/
    └── vite-project/
        ├── src/
        │   ├── components.jsx/
        │   │   ├── ChatBot.jsx
        │   │   ├── AINotesHelper.jsx
        │   │   ├── AISetupInfo.jsx
        │   │   ├── Navbar.jsx
        │   │   ├── NoteCard.jsx
        │   │   ├── NotesNotFound.jsx
        │   │   └── RateLimitedUI.jsx
        │   ├── pages/
        │   │   ├── HomePage.jsx
        │   │   ├── CreatePage.jsx
        │   │   └── NotedetailPage.jsx
        │   ├── lib/
        │   │   ├── axios.js
        │   │   └── utils.js
        │   ├── App.jsx
        │   └── main.jsx
        └── package.json
```

## 🚀 Production Deployment

1. **Build Frontend:**
   ```bash
   cd frontend/vite-project
   npm run build
   ```

2. **Environment Variables:**
   Set `NODE_ENV=production` in your production environment

3. **Start Production Server:**
   ```bash
   cd backend
   npm start
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Troubleshooting

### AI Features Not Working
- Ensure OpenAI API key is correctly set in `.env`
- Check that you have sufficient OpenAI credits
- Restart the backend server after adding the API key

### Database Connection Issues
- Verify MongoDB connection string
- Check network connectivity
- Ensure MongoDB Atlas IP whitelist includes your IP

### Port Conflicts
- Backend default port: 3000
- Frontend default port: 5173
- Change ports in configuration files if needed

## 📞 Support

If you encounter any issues, please check the troubleshooting section or create an issue in the repository.
