// @ts-check

import Tile from "./titles";
import { Box, Stack } from "@mui/material";

const Grid = (props: any) => {
  const { tiles, onTileClick, gridSize } = props;
  return (
    <Stack
      sx={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        minHeight: "500px",
      }}
    >
      <Box
        sx={{
          width: `${props?.tileSize * props?.gridSize}px`,
          height: `${props?.tileSize * props?.gridSize}px`,
          position: "relative",
          textAlign: "center",
        }}
      >
        {tiles.map((tile: any, index: number) => {
          return (
            <Tile
              {...tile}
              key={`tile-${index}`}
              correct={tile.tileId + 1 === tile.number}
              onClick={onTileClick}
              visible={tile.number < gridSize ** 2}
            />
          );
        })}
      </Box>
    </Stack>
  );
};

export default Grid;
