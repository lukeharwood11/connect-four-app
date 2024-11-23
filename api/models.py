from pydantic import BaseModel
from typing import List


class BoardRequest(BaseModel):
    board: List[List[int]]
