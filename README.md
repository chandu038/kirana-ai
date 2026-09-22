# 🛒 Kirana AI — AI-Powered Grocery Shopping Assistant

> Shop smarter with AI — discover products, manage your cart, place orders, and get personalized shopping assistance all in one place.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-kirana--ai--gamma.vercel.app-brightgreen?style=for-the-badge&logo=vercel)](https://kirana-ai-gamma.vercel.app/)
[![React](https://img.shields.io/badge/React-18%2B-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Python](https://img.shields.io/badge/Python-FastAPI-yellow?style=for-the-badge&logo=python)](https://fastapi.tiangolo.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

---

## 📌 About

**Kirana AI** is a modern AI-powered grocery shopping platform designed to make online grocery shopping simple, interactive, and intelligent.

Users can browse and search for grocery products, manage their shopping cart, place orders, and interact with an AI shopping assistant for product and order-related assistance.

The application is built with a **React frontend**, **FastAPI backend**, **PostgreSQL database**, and **OpenAI-powered AI assistant** using LangChain.

🌐 **Live site:** [kirana-ai-gamma.vercel.app](https://kirana-ai-gamma.vercel.app/)

---

## ✨ Features

### 👤 For Customers

- 🔐 **Google Authentication** — Secure login using Google OAuth
- 🔎 **Product Search & Browsing** — Discover and search grocery products
- 🛒 **Shopping Cart** — Add, remove, and manage products
- 📦 **Order Management** — Place and manage grocery orders
- 🤖 **AI Shopping Assistant** — Get intelligent shopping assistance
- 💬 **Interactive AI Chat** — Natural-language conversations with the assistant
- 👤 **User Profile** — Manage user information
- 📱 **Responsive UI** — Works across desktop, tablet, and mobile devices

### 🤖 AI Assistant

- 🧠 **AI-Powered Conversations** — Natural-language grocery assistance
- 🔗 **LangChain Agent** — Agent-based AI architecture
- 🛠️ **Tool Integration** — AI can interact with application functionality
- 🛍️ **Shopping Assistance** — Product and order-related queries
- ⚡ **Real-Time Responses** — Interactive conversational experience

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React.js, Vite |
| Styling | Tailwind CSS, shadcn/ui |
| Backend | Python, FastAPI |
| AI | OpenAI, LangChain |
| Database | PostgreSQL |
| ORM | SQLAlchemy |
| Authentication | Google OAuth, JWT |
| Containerization | Docker |
| Frontend Hosting | Vercel |
| Backend Hosting | AWS ECS Fargate |
| Load Balancer | AWS Application Load Balancer |
| Container Registry | Amazon ECR |
| Database Hosting | AWS RDS |

---

## 🏗️ Architecture

```text
                     ┌─────────────────────┐
                     │    React Frontend   │
                     │       Vercel        │
                     └──────────┬──────────┘
                                │
                                ▼
                     ┌─────────────────────┐
                     │   AWS Application   │
                     │   Load Balancer     │
                     └──────────┬──────────┘
                                │
                                ▼
                     ┌─────────────────────┐
                     │   FastAPI Backend   │
                     │    ECS Fargate      │
                     └──────┬────────┬─────┘
                            │        │
                 ┌──────────▼───┐  ┌─▼────────────┐
                 │  PostgreSQL  │  │  OpenAI API  │
                 │    AWS RDS   │  │  + LangChain │
                 └──────────────┘  └──────────────┘
```

---

## 📁 Project Structure

```text
kirana-ai/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── ...
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── vercel.json
│
└── backend/
    ├── app/
    │   ├── routers/
    │   ├── agent.py
    │   ├── agent_logging.py
    │   ├── auth.py
    │   ├── database.py
    │   ├── guardails.py
    │   ├── models.py
    │   ├── schemas.py
    │   └── main.py
    ├── Dockerfile
    ├── pyproject.toml
    └── uv.lock
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Python 3.11+
- PostgreSQL
- Git
- Docker (optional)

### Frontend Installation

```bash
# Clone the repository
git clone https://github.com/chandu038/kirana-ai.git

# Navigate to frontend
cd kirana-ai/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at:

```
http://localhost:5173
```

### Backend Installation

```bash
# Navigate to backend
cd kirana-ai-backend

# Install dependencies
uv sync

# Start FastAPI server
uv run uvicorn app.main:app --reload
```

The backend will be available at:

```
http://localhost:8000
```

API documentation:

```
http://localhost:8000/docs
```

---

## 🔐 Environment Variables

### Frontend

Create a `.env` file:

```env
VITE_API_URL=your_backend_url
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### Backend

Configure the required environment variables for:

- PostgreSQL database
- OpenAI API
- JWT authentication
- Google authentication
- CORS configuration

⚠️ **Never commit `.env` files, API keys, database credentials, or authentication secrets to GitHub.**

---

## 🌍 Deployment

### Frontend

The frontend is deployed on **Vercel** with a production React/Vite build.

### Backend

The backend is containerized using **Docker** and deployed on **AWS ECS Fargate**.

The deployment uses:

- Amazon ECR for Docker images
- AWS ECS Fargate for running the backend
- AWS Application Load Balancer for HTTP traffic
- AWS RDS for PostgreSQL

### Database

The production PostgreSQL database is hosted on **AWS RDS**.

---

## 🔗 Project Links

**Live Application:**
https://kirana-ai-gamma.vercel.app/

**Frontend Repository:**
https://github.com/chandu038/kirana-ai

**Backend Repository:**
https://github.com/chandu038/Kiranaai-backend

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add some feature"
   ```
4. Push the branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a Pull Request

---

## 🐛 Issues

Found a bug or have a feature request?

Open an issue in the repository and describe the problem or improvement clearly.

---

## 📄 License

This project is open-source and available under the MIT License.

---

## 👨‍💻 Author

**Darapaneni Chandu**

B.Tech Computer Science & Engineering

GitHub: [@chandu038](https://github.com/chandu038)

<p align="center">Made with ❤️ and ☕ for smarter grocery shopping</p>
