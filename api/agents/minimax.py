from api.agents.base import Agent
from typing import List, Tuple
import numpy as np
import copy


class MinimaxAgent(Agent):

    MAX_DEPTH = 3

    def _get_score(self, board: List[List[int]]) -> int:
        # First check terminal states
        term_out = self._is_terminal(board)
        if term_out == -1:
            return 100000
        elif term_out == 1:
            return -100000
        elif term_out == 0:
            return 0

        board = np.array(board)
        score = 0

        # Preference for center column
        center_array = board[:, 3]
        center_count = np.sum(center_array == -1)
        score += center_count * 3

        # Check all possible windows of 4
        for r in range(6):
            for c in range(7):
                # Horizontal windows
                if c <= 3:
                    window = board[r, c : c + 4]
                    score += self._evaluate_window(window)

                # Vertical windows
                if r <= 2:
                    window = board[r : r + 4, c]
                    score += self._evaluate_window(window)

                # Diagonal windows (positive slope)
                if r <= 2 and c <= 3:
                    window = [board[r + i][c + i] for i in range(4)]
                    score += self._evaluate_window(window)

                # Diagonal windows (negative slope)
                if r <= 2 and c <= 3:
                    window = [board[r + 3 - i][c + i] for i in range(4)]
                    score += self._evaluate_window(window)

        return score

    def _evaluate_window(self, window) -> int:
        """
        Evaluate a window of 4 positions
        Returns a score based on the contents
        """
        score = 0
        player_count = np.sum(window == 1)
        ai_count = np.sum(window == -1)
        empty_count = np.sum(window == 0)

        # AI pieces (higher weights for offensive play)
        if ai_count == 4:
            score += 1000
        elif ai_count == 3 and empty_count == 1:
            score += 50
        elif ai_count == 2 and empty_count == 2:
            score += 10

        # Player pieces (defensive weights)
        if player_count == 3 and empty_count == 1:
            score -= 80
        elif player_count == 2 and empty_count == 2:
            score -= 20

        return score

    def _is_terminal(self, board: List[List[int]]) -> int | None:
        """Check for a winner
        :return: 1 if the player wins, -1 if the ai wins, 0 if it's a draw and None if it's not terminal
        """
        right_diagonal = np.eye(4)
        left_diagonal = np.fliplr(right_diagonal)
        board = np.array(board)
        for x in range(6):
            for y in range(7):
                if x < 3:
                    if np.all(board[x : x + 4, y] == 1):
                        return 1
                    elif np.all(board[x : x + 4, y] == -1):
                        return -1
                if y < 4:
                    if np.all(board[x, y : y + 4] == 1):
                        return 1
                    elif np.all(board[x, y : y + 4] == -1):
                        return -1
                if x < 3 and y < 4:
                    if np.sum(board[x : x + 4, y : y + 4] * right_diagonal) == 4:
                        return 1
                    elif np.sum(board[x : x + 4, y : y + 4] * right_diagonal) == -4:
                        return -1
                    if np.sum(board[x : x + 4, y : y + 4] * left_diagonal) == 4:
                        return 1
                    elif np.sum(board[x : x + 4, y : y + 4] * left_diagonal) == -4:
                        return -1
        if np.all(board != 0):
            return 0
        return None

    def _get_valid_moves(self, board: List[List[int]]) -> List[int]:
        """Returns list of valid columns to play"""
        valid_moves = []
        for col in range(7):
            if board[0][col] == 0:
                valid_moves.append(col)
        return valid_moves

    def minimax(
        self,
        board: List[List[int]],
        depth: int,
        alpha: float,
        beta: float,
        maximizing_player: bool,
    ) -> Tuple[int, int]:
        valid_moves = self._get_valid_moves(board)
        terminal_state = self._is_terminal(board)

        if depth == self.MAX_DEPTH or terminal_state is not None or not valid_moves:
            # if it's the next move, it's weighted more
            return self._get_score(board) / (depth + 1), None

        if maximizing_player:
            value = float("-inf")
            column = np.random.choice(valid_moves)
            for move in valid_moves:
                if move == 3:
                    valid_moves.insert(0, valid_moves.pop(valid_moves.index(move)))

                for row in range(5, -1, -1):
                    if board[row][move] == 0:
                        board_copy = copy.deepcopy(board)
                        board_copy[row][move] = -1
                        eval_score, _ = self.minimax(
                            board_copy, depth + 1, alpha, beta, False
                        )
                        if eval_score > value:
                            value = eval_score
                            column = move
                        alpha = max(alpha, value)
                        if alpha >= beta:
                            break
                        break
            return value, column
        else:
            value = float("inf")
            column = np.random.choice(valid_moves)
            for move in valid_moves:
                for row in range(5, -1, -1):
                    if board[row][move] == 0:
                        board_copy = copy.deepcopy(board)
                        board_copy[row][move] = 1
                        eval_score, _ = self.minimax(
                            board_copy, depth + 1, alpha, beta, True
                        )
                        if eval_score < value:
                            value = eval_score
                            column = move
                        beta = min(beta, value)
                        if alpha >= beta:
                            break
                        break
            return value, column

    def get_move(self, board: List[List[int]]) -> int | None:
        _, move = self.minimax(board, 0, float("-inf"), float("inf"), True)
        return move
