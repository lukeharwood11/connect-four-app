from abc import ABC, abstractmethod
from typing import List

class Agent(ABC):
    @abstractmethod
    def get_move(self, board: List[List[int]]) -> int | None:
        pass
