from abc import ABC, abstractmethod
from typing import List


class Agent(ABC):

    @classmethod
    def get_valid_moves(cls, board: List[List[int]]) -> List[int]:
        return [i for i in range(7) if board[0][i] == 0]

    @abstractmethod
    def get_move(self, board: List[List[int]]) -> int | None:
        pass
