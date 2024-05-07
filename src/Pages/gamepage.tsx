import { useState, useEffect, useCallback } from "react";
import levelFactory from "./../lib/levels-factory";
import Game from "../components/game";
import { Stack } from "@mui/material";

interface Level {
  tileSet: number[];
}

export const GamePage = () => {
  const [original, setOriginal] = useState<Level>(levelFactory(4 ** 2));
  const [level, setLevel] = useState<Level>(() => ({ ...original }));
  const [moves, setMoves] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);

  useEffect(() => {
    setOriginal(levelFactory(4 ** 2));
  }, []);

  const onResetClick = useCallback(() => {
    setLevel({
      tileSet: original.tileSet.slice(),
    });
    setMoves(0);
    setSeconds(0);
  }, [original.tileSet]);

  const onNewClick = useCallback(() => {
    const newLevel = levelFactory(4 ** 2);
    setOriginal({ ...newLevel });
    setLevel({ ...newLevel });
    setMoves(0);
    setSeconds(0);
  }, []);

  return (
    <Stack minHeight={"100vh"} alignItems="center">
      <Game
        gridSize={4}
        tileSize={90}
        numbers={level.tileSet}
        onResetClick={onResetClick}
        onNewClick={onNewClick}
        original={original.tileSet}
        moves={moves}
        setMoves={setMoves}
        seconds={seconds}
        setSeconds={setSeconds}
      />
    </Stack>
  );
};
