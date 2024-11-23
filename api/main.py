from fastapi import FastAPI
from api.controller import Controller
from api.router import router

controller = Controller()

app = FastAPI(
    title="AI Connect4",
    description="An AI Connect4 game",
    version="0.1.0",
)

@app.get("/example")
async def root():
    return {"message": "Hello, World!"}

app.include_router(router)