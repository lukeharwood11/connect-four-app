from api.agents.base import Agent
from typing import List
from openai import OpenAI
from api.settings import Settings
import logging
import re

log = logging.getLogger(__name__)

settings = Settings()

client = OpenAI(api_key=settings.openai_api_key)


class OpenAIAgent(Agent):

    SYSTEM_PROMPT = """You are a Connect 4 champion."""

    PROMPT = """The board is represented as a 2D array of integers, where 0 is an empty space, 1 is the user's piece, and -1 is your piece.
    The goal is to return the column index of the move you want to make. Again, you are playing as the piece with the value -1.
    Strategize and think about your next move.
    Format your response as follows and always use valid XML:
    INPUT:
    <board>
    [the board state]
    </board>
    
    OUTPUT:
    <defensive>
    [1 sentence thought on a defensive move idea]
    </defensive>
    <offensive>
    [1 sentence thought on an offensive move idea]
    </offensive>
    <column>[the column index, where 0 is the leftmost column, and 6 is the rightmost column]</column>

    GO!
    INPUT:
    <board>
    {board}
    </board>

    OUTPUT:
    """

    def _get_move(self, board: List[List[int]]) -> int | None:
        board_str = "\n".join([" ".join(map(str, row)) for row in board])
        response = client.chat.completions.create(
            model=settings.openai_model,
            messages=[
                {"role": "system", "content": self.SYSTEM_PROMPT},
                {"role": "user", "content": self.PROMPT.format(board=board_str)},
            ],
            temperature=0.0,
            max_tokens=200,
        )
        text = response.choices[0].message.content
        offensive = re.search(r"<offensive>(.*)</offensive>", text, re.DOTALL)
        defensive = re.search(r"<defensive>(.*)</defensive>", text, re.DOTALL)
        if offensive:
            log.info(f"LLM Offensive Thought: '{offensive.group(1).strip()}'")
        if defensive:
            log.info(f"LLM Defensive Thought: '{defensive.group(1).strip()}'")
        match = re.search(r"<column>(.*)</column>", text)
        # remove all non-digits
        column = re.sub(r"\D", "", match.group(1))
        if column:
            return int(column)
        return None

    def get_move(self, board: List[List[int]]) -> int | None:
        valid_moves = self.get_valid_moves(board)
        for _ in range(2):
            move = self._get_move(board)
            if move in valid_moves:
                return move
        return None
