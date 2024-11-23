from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from api.controller import Controller
from api.router import router
from fastapi import FastAPI
import logging

logging.basicConfig(level=logging.INFO)
log = logging.getLogger(__name__)
log.info("Starting Connect4 API...")

controller = Controller()

app = FastAPI(
    title="AI Connect4",
    description="An AI Connect4 game",
    version="0.1.0",
)

app.include_router(router)

# serve the react application
@app.get("/")
async def root():
    return FileResponse("./build/index.html")

app.mount("/", StaticFiles(directory="./build"), name="static")
