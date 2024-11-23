from fastapi import APIRouter, HTTPException
from api.models import BoardRequest
from api.controller import Controller

controller = Controller()

router = APIRouter(prefix="/api")


@router.post("/agent/{agent}")
async def get_agent_move(agent: str, request: BoardRequest):
    if not controller.is_valid_agent(agent):
        raise HTTPException(status_code=404, detail=f"Invalid agent: {agent}")
    move = controller.get_move(agent, request.board)
    if move is None:
        raise HTTPException(status_code=400, detail="Invalid board state given.")
    return {"move": move}

