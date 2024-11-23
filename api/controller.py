from api.agents.minimax import MinimaxAgent
from api.agents.openai import OpenAIAgent
from api.agents.rand import RandomAgent
from api.agents.base import Agent
from typing import List


class Controller:
    agent_map = {
        "random": RandomAgent(),
        "minimax": MinimaxAgent(),
        "openai": OpenAIAgent(),
    }

    def _get_agent(self, agent_name: str) -> Agent:
        return self.agent_map[agent_name]

    def is_valid_agent(self, agent_name: str) -> bool:
        return agent_name in self.agent_map

    def get_move(self, agent_name: str, board: List[List[int]]) -> int | None:
        agent = self._get_agent(agent_name)
        return agent.get_move(board)
