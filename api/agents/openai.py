from api.agents.base import Agent
from typing import List

class OpenAIAgent(Agent):
    def get_move(self, board: List[List[int]]) -> int | None:
        pass

