import { useTheme } from "@material-ui/core/styles";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import ReplayIcon from "@mui/icons-material/Replay";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import React, { useCallback, useEffect } from "react";
import MediaQuery from "react-responsive";
import { GameStatus, GAME_PAUSED, GAME_STARTED } from "../lib/game-status";
import {
  AppBar,
  Avatar,
  Button,
  Chip,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

type Props = {
  seconds: number;
  moves: number;
  onResetClick: () => void;
  onPauseClick: () => void;
  onNewClick: () => void;
  gameState: GameStatus;
};

export const Menu: React.FC<Props> = ({
  seconds = 0,
  moves = 0,
  onResetClick,
  onPauseClick,
  onNewClick,
  gameState,
}) => {
  const theme = useTheme();
  const navigation = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigation("/");
  });

  const handleLogout = useCallback(() => {
    localStorage.setItem("token", "");
    navigation("/");
  }, [navigation]);

  return (
    <AppBar
      elevation={4}
      sx={{
        width: "100%",
        backgroundColor: "rgb(232, 232, 232)",
        borderRadius: 4,
        position: "absolute",
        top: 15,
      }}
    >
      <Toolbar>
        <Typography
          sx={{
            color: "#000",
            flexGrow: 1,
          }}
          variant="h6"
          component="div"
        >
          Brain Game
        </Typography>

        <Button
          aria-label="Start a new game"
          onClick={onNewClick}
          startIcon={<PowerSettingsNewIcon className="menuIcon" />}
        >
          <Typography component="span" variant="button">
            New game
          </Typography>
        </Button>
        <Button
          aria-label="Pause/Continue current game."
          onClick={onPauseClick}
          startIcon={
            gameState === GAME_PAUSED ? (
              <PlayArrowIcon className="menuIcon" />
            ) : (
              <PauseIcon className="menuIcon" />
            )
          }
          disabled={gameState !== GAME_STARTED && gameState !== GAME_PAUSED}
        >
          <Typography component="span" variant="button">
            {gameState === GAME_PAUSED ? "Continue" : "Pause"}
          </Typography>
        </Button>
        <Button
          aria-label="Reset game"
          onClick={onResetClick}
          startIcon={<ReplayIcon />}
        >
          <MediaQuery query={theme.breakpoints.up("md")} component="span">
            Reset game
          </MediaQuery>
        </Button>
        <Stack direction="row" spacing={2}>
          <Chip
            avatar={
              <Avatar>
                <AccessAlarmIcon />
              </Avatar>
            }
            label={
              <>
                <MediaQuery query={theme.breakpoints.up("md")} component="span">
                  Time Elapsed:
                </MediaQuery>
                <Typography component="span">{seconds}s</Typography>
              </>
            }
          />
          <Chip
            avatar={
              <Avatar>
                <CompareArrowsIcon />
              </Avatar>
            }
            label={
              <>
                <MediaQuery query={theme.breakpoints.up("md")} component="span">
                  Moves so far:
                </MediaQuery>
                <Typography component="span">{moves}</Typography>
              </>
            }
          />
        </Stack>
        <Button variant="text" onClick={handleLogout}>
          Log-out
        </Button>
      </Toolbar>
    </AppBar>
  );
};
