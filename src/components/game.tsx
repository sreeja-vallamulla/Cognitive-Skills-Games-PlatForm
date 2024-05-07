import React, {
  useState,
  useEffect,
  useCallback,
  KeyboardEvent,
  Dispatch,
  SetStateAction,
} from "react";

import {
  GAME_IDLE,
  GAME_OVER,
  GAME_PAUSED,
  GAME_STARTED,
} from "../lib/game-status";
import { distanceBetween, getTileCoords, invert } from "../lib/utils";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
} from "@mui/material";
import Grid from "./grid";
import { Menu } from "./Menu";

interface Tile {
  width: number;
  height: number;
  number: number;
  tileId: number;
  row: number;
  column: number;
}

interface GameProps {
  numbers: number[];
  tileSize: number;
  gridSize: number;
  moves?: number;
  seconds?: number;
  original: number[];
  onResetClick: () => void;
  onNewClick: () => void;
  setMoves: Dispatch<SetStateAction<number>>;
  setSeconds: Dispatch<SetStateAction<number>>;
}

const Game: React.FC<GameProps> = (props) => {
  const { moves, setMoves, seconds, setSeconds } = props;
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [gameState, setGameState] = useState<any>(GAME_IDLE);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarText, setSnackbarText] = useState<string>("");

  const timerIdRef = React.useRef<NodeJS.Timeout | null>(null);

  const generateTiles = useCallback(
    (numbers: number[], gridSize: number, tileSize: number): Tile[] => {
      return numbers.map((number, index) => ({
        ...getTileCoords(index, gridSize, tileSize),
        width: props.tileSize,
        height: props.tileSize,
        number,
      }));
    },
    [props.tileSize]
  );
  const keyDownListener = useCallback(
    (key: KeyboardEvent) => {
      if (key.ctrlKey && key.altKey && key.code === "KeyF") {
        const { original, gridSize, tileSize } = props;
        const solvedTiles = generateTiles(original, gridSize, tileSize).map(
          (tile, index) => {
            tile.number = index + 1;
            return { ...tile };
          }
        );

        if (timerIdRef.current) {
          clearInterval(timerIdRef.current);
        }

        setGameState(GAME_OVER);
        setTiles(solvedTiles);
        setDialogOpen(true);
      }
    },
    [generateTiles, props]
  );

  useEffect(() => {
    const newTiles = generateTiles(
      props.numbers,
      props.gridSize,
      props.tileSize
    );
    setTiles(newTiles);

    return () => {
      if (timerIdRef.current) {
        clearInterval(timerIdRef.current);
      }
    };
  }, [props.numbers, props.gridSize, props.tileSize, generateTiles]);

  useEffect(() => {
    document.addEventListener("keydown", keyDownListener as any);

    return () => {
      document.removeEventListener("keydown", keyDownListener as any);
    };
  }, [keyDownListener]);

  useEffect(() => {
    const { original, gridSize, tileSize } = props;

    const keyDownListener = (key: any) => {
      if (key.ctrlKey && key.altKey && key.code === "KeyF") {
        const solvedTiles = generateTiles(original, gridSize, tileSize).map(
          (tile, index) => {
            tile.number = index + 1;
            return { ...tile };
          }
        );

        if (timerIdRef.current) {
          clearInterval(timerIdRef.current);
        }

        setGameState(GAME_OVER);
        setTiles(solvedTiles);
        setDialogOpen(true);
      }
    };

    return () => {
      document.removeEventListener("keydown", keyDownListener);
    };
  }, [generateTiles, props]);

  const handleDialogClose = useCallback(() => {
    setDialogOpen(false);
  }, []);

  const handleSnackbarClose = useCallback(() => {
    setSnackbarOpen(false);
  }, []);

  const isGameOver = (tiles: Tile[]): boolean => {
    const correctedTiles = tiles.filter(
      (tile) => tile.tileId + 1 === tile.number
    );

    if (correctedTiles.length === props.gridSize ** 2) {
      if (timerIdRef.current) {
        clearInterval(timerIdRef.current);
      }
      return true;
    } else {
      return false;
    }
  };

  const addTimer = () => {
    setSeconds((prevSeconds) => prevSeconds + 1);
  };

  const setTimer = () => {
    timerIdRef.current = setInterval(() => {
      addTimer();
    }, 1000);
  };

  const onPauseClick = () => {
    setGameState((prevState: any) => {
      let newGameState = null;
      let newSnackbarText = null;

      if (prevState === GAME_STARTED) {
        if (timerIdRef.current) {
          clearInterval(timerIdRef.current);
        }
        newGameState = GAME_PAUSED;
        newSnackbarText = "The game is currently paused.";
      } else {
        setTimer();
        newGameState = GAME_STARTED;
        newSnackbarText = "Game on!";
      }

      setSnackbarOpen(true);
      setSnackbarText(newSnackbarText);

      return newGameState;
    });
  };

  const onTileClick = (tile: any) => {
    if (gameState === GAME_OVER || gameState === GAME_PAUSED) {
      return;
    }

    // Set Timer in case of first click
    if (moves === 0) {
      setTimer();
    }

    const { gridSize } = props;

    // Find empty tile
    const emptyTile = tiles.find((t) => t.number === gridSize ** 2);
    const emptyTileIndex = tiles.indexOf(emptyTile as Tile);

    // Find index of tile
    const tileIndex = tiles.findIndex((t) => t.number === tile.number);

    // Is this tale neighbouring the zero tile? If so, switch them.
    const d = distanceBetween(tile, emptyTile as any);
    if (d.neighbours) {
      const newTiles = Array.from(tiles).map((t) => ({ ...t }));

      invert(newTiles, emptyTileIndex, tileIndex, [
        "top",
        "left",
        "row",
        "column",
        "tileId",
      ]);

      const checkGameOver = isGameOver(newTiles);

      setGameState(checkGameOver ? GAME_OVER : GAME_STARTED);
      setTiles(newTiles);
      setMoves((prevMoves) => prevMoves + 1);
      setDialogOpen(checkGameOver);
    }
  };

  const { gridSize, tileSize, onResetClick, onNewClick } = props;

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
      }}
    >
      <Menu
        seconds={seconds ?? 0}
        moves={moves ?? 0}
        onResetClick={onResetClick}
        onPauseClick={onPauseClick}
        onNewClick={onNewClick}
        gameState={gameState}
      />
      <Grid
        gridSize={gridSize}
        tileSize={tileSize}
        tiles={tiles}
        onTileClick={onTileClick}
      />
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Congratulations!</DialogTitle>
        <DialogContent>
          You've solved the puzzle in {moves} moves in {seconds} seconds!
        </DialogContent>
        <DialogActions>
          <Button variant="text" onClick={handleDialogClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        message={snackbarText}
        onClose={handleSnackbarClose}
      />
    </div>
  );
};

export default Game;
