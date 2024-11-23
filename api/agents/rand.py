from random import choice
from api.agents.base import Agent
from typing import List


class RandomAgent(Agent):

    def get_move(self, board: List[List[int]]) -> int | None:
        """Return a random valid move. Return None if no valid moves are available."""
        valid_moves = [i for i in range(7) if board[0][i] == 0]
        return choice(valid_moves) if valid_moves else None
