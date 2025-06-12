import json
from fastapi import APIRouter, FastAPI
from mas import MASManager

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.post("/test/mas")
async def test_mas(user_input:json):
    mas_manager = MASManager()
    mas_manager.run(user_input)
    return mas_manager
