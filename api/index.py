from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# CORS so the frontend can talk to backend
_raw_origins = os.getenv("ALLOWED_ORIGINS", "*")
_origins = [o.strip() for o in _raw_origins.split(",")] if _raw_origins != "*" else ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class ChatRequest(BaseModel):
    message: str

@app.get("/")
def root():
    return {"status": "ok"}

@app.post("/api/chat")
def chat(request: ChatRequest):
    if not os.getenv("OPENAI_API_KEY"):
        raise HTTPException(status_code=500, detail="OPENAI_API_KEY not configured")
    
    try:
        user_message = request.message
        response = client.chat.completions.create(
            model="gpt-4.1-mini",
            messages=[
                {"role": "system", "content": (
                    "You are 'The Oracle' — a fun, passionate, and slightly over-the-top World Cup match predictor. "
                    "You have deep knowledge of every FIFA World Cup tournament, all national teams, historical results, "
                    "top scorers, iconic moments, and current squad form.\n\n"
                    "When a user asks you to predict a match, give a confident prediction with a scoreline, "
                    "explain your reasoning with 2-3 fun facts or stats to back it up, and add a cheeky comment "
                    "about the losing team.\n\n"
                    "When asked about past matches or tournaments, narrate them with energy and drama like a "
                    "commentator. Always keep the tone fun, punchy, and like you're chatting with a fellow fan "
                    "at the pub. Use football slang naturally. Never be dry or academic.\n\n"
                    "If the user asks something unrelated to football or the World Cup, playfully redirect them back "
                    "to the beautiful game."
                )},
                {"role": "user", "content": user_message}
            ]
        )
        return {"reply": response.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calling OpenAI API: {str(e)}")
