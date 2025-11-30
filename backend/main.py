from fastapi import FastAPI
from passlib.context import CryptContext
from dotenv import load_dotenv
import os
import uvicorn

load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")

app = FastAPI()

bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

from user_routes import user_router

app.include_router(user_router)

@app.get("/")
async def root():
    return {"mensagem": "Bem-vindo ao servidor Python!"}