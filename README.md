# Perplexity-FullStack

### AI-powered full-stack research assistant

Perplexity-FullStack is a full-stack AI application inspired by modern AI search platforms. It combines conversational AI with external APIs to give users a single place to ask questions, get real-time information, manage conversations, and use AI-powered productivity features.

The project was built to understand how an AI application works across the **frontend, backend, database, authentication, AI integration, and third-party APIs** rather than treating AI as just a simple chatbot.

**Live Demo:** https://perplexity-full-stack.vercel.app/
**GitHub:** https://github.com/kharerudransh/Perplexity-FullStack

---

## Features

### AI Chat

* Conversational AI experience powered by Google Gemini
* Context-aware conversations
* AI-generated titles for conversations
* Persistent chat history

### Real-Time Information

The application integrates external APIs to provide useful information such as:

* Weather updates
* Currency / foreign exchange information
* News
* Live cricket scores

### User Authentication

* User registration and login
* Cookie-based authentication
* User-specific conversations and chat history

### AI-Powered Email

* Generate email content using AI
* Generate structured HTML emails
* Send emails directly from the application

### Interactive UI

* Responsive React interface
* Axios-based API communication
* Interactive 3D elements using Three.js
* Real-time communication using WebSockets

---

## Tech Stack

| Category        | Technologies                      |
| --------------- | --------------------------------- |
| Frontend        | React.js, JavaScript, HTML5, CSS3 |
| Backend         | Node.js, Express.js               |
| AI              | Google Gemini, LangChain          |
| Database        | MongoDB                           |
| Communication   | REST APIs, WebSockets             |
| Libraries       | Axios, Three.js                   |
| Authentication  | Cookies                           |
| Deployment      | Vercel                            |
| Version Control | Git, GitHub                       |

---

## How It Works

```text
                    ┌──────────────────┐
                    │      User        │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │   React.js UI    │
                    │    Frontend      │
                    └────────┬─────────┘
                             │
                    REST / WebSocket
                             │
                             ▼
                    ┌──────────────────┐
                    │ Node.js +        │
                    │ Express Backend  │
                    └────────┬─────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
        ┌──────────┐   ┌──────────┐   ┌──────────┐
        │ Gemini + │   │ MongoDB  │   │ External │
        │LangChain │   │ Database │   │   APIs   │
        └──────────┘   └──────────┘   └──────────┘
```

### Request Flow

1. A user sends a question through the React frontend.
2. The frontend communicates with the Node.js/Express backend.
3. The backend processes the request and determines the required service.
4. Gemini and LangChain handle the AI-related workflow.
5. External APIs are used when real-time information is required.
6. Conversation data is stored in MongoDB.
7. The processed response is returned to the frontend and displayed to the user.

---

## Project Structure

```text
Perplexity-FullStack/
│
├── Frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── services/
│   └── package.json
│
├── package-lock.json
└── README.md
```

---

## Deployment

The application is deployed and available online:

**https://perplexity-full-stack.vercel.app/**

The production deployment uses environment variables for API keys, database configuration, and other sensitive settings.

---

## What I Learned

Building this project gave me practical experience with:

* Building and connecting a React frontend with a Node.js backend
* Designing REST APIs
* Working with MongoDB
* Implementing authentication and cookies
* Integrating Google Gemini with LangChain
* Connecting and consuming third-party APIs
* Handling real-time communication with WebSockets
* Managing frontend/backend environment variables
* Debugging production-specific issues
* Deploying a full-stack application

---

## Future Improvements

* Streaming AI responses
* Better web search with source citations
* PDF and document analysis
* Voice-based interaction
* Improved conversational memory
* Better mobile responsiveness
* More AI-powered productivity tools

---



**Live Demo:** https://perplexity-full-stack.vercel.app/
