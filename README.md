<p align="center" draggable="false"><img src="https://github.com/AI-Maker-Space/LLM-Dev-101/assets/37101144/d1343317-fa2f-41e1-8af1-1dbb18399719"
     width="200px"
     height="auto"/>
</p>

<h1 align="center">👋 The AI Engineer Challenge</h1>

<p align="center">
  <strong>The Oracle</strong> — a World Cup match predictor powered by GPT-4.1-mini
</p>

---

## 🔮 About

**The Oracle** is an AI-powered football chatbot that predicts World Cup matches, recalls tournament history, and settles football debates — all with the energy of a passionate fan at the pub.

Built with a **Next.js** frontend and a **FastAPI** backend, it uses OpenAI's `gpt-4.1-mini` model with a carefully crafted system prompt that gives the assistant its punchy, football-obsessed personality.

---

## 🏗️ Project Structure

```
├── api/
│   └── index.py          # FastAPI backend — POST /api/chat endpoint
├── oracle-app/           # Next.js 16 + React 19 frontend
│   └── app/
│       └── page.tsx      # Main chat UI
├── pyproject.toml        # Python dependencies (uv / pip)
├── requirements.txt      # Pinned Python requirements
└── vercel.json           # Vercel routing config
```

---

## 🚀 Tech Stack

| Layer      | Technology                                       |
| ---------- | ------------------------------------------------ |
| Frontend   | Next.js 16, React 19, TypeScript, Tailwind CSS 4 |
| Backend    | FastAPI, Python 3.12, Uvicorn                    |
| AI Model   | OpenAI `gpt-4.1-mini`                            |
| Deployment | Vercel (serverless)                              |

---

## ⚙️ Local Development

### Prerequisites

- Node.js 18+
- Python 3.12
- [uv](https://github.com/astral-sh/uv) (recommended) or pip
- An OpenAI API key

### 1. Clone the repo

```bash
git clone https://github.com/thepembeweb/the-ai-engineer-challenge.git
cd the-ai-engineer-challenge
```

### 2. Set up the backend

```bash
# Create a .env file
echo "OPENAI_API_KEY=sk-..." > .env

# Install dependencies and run the API server
uv run uvicorn api.index:app --reload
```

The API will be available at `http://localhost:8000`.

### 3. Set up the frontend

```bash
cd oracle-app
npm install
npm run dev
```

The frontend will be available at `http://localhost:3000`.

> The frontend expects the backend at `http://localhost:8000`. Update the API URL in `oracle-app/app/page.tsx` if you use a different port.

---

## 🌐 Deployment (Vercel)

The project is configured for Vercel deployment with `vercel.json` routing all requests to the FastAPI handler.

```bash
# Add your OpenAI key as a Vercel environment variable
vercel env add OPENAI_API_KEY production

# Deploy
vercel --prod
```

---

## 🔑 Environment Variables

| Variable          | Description                                 | Required |
| ----------------- | ------------------------------------------- | -------- |
| `OPENAI_API_KEY`  | Your OpenAI API key                         | ✅       |
| `ALLOWED_ORIGINS` | Comma-separated CORS origins (default: `*`) | ❌       |

---

## 💬 Features

- **Match predictions** — ask for any national team matchup and get a confident scoreline with reasoning
- **Tournament history** — deep knowledge of every FIFA World Cup, iconic moments, and top scorers
- **Quick prompts** — one-click starters like _"Who wins the 2026 World Cup?"_ or _"Biggest upset in World Cup history?"_
- **Streaming-style chat UI** — message bubbles, loading indicator, and auto-scroll

---

## 📄 License

MIT
