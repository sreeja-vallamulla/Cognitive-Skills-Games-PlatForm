import { Box, Stack } from "@mui/material";

type Props = {
  tileId: number;
  number: number;
  onClick: (props: Props) => void;
  width: number;
  height: number;
  correct: boolean;
  left: number;
  top: number;
  visible?: boolean;
};

const Tile = (props: Props) => {
  const { number = 0, onClick } = props;

  return (
    <Stack
      onClick={() => onClick(props)}
      sx={{
        display: props?.visible ? "flex" : "none",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        border: "1px solid #FFD1AA",
        width: props.width,
        height: props.height,
        left: props.left,
        top: props.top,
        cursor: "pointer",
        backgroundColor: props?.correct ? "#226666" : "#D4726A",
        transitionProperty: "top, left, background-color",
        transitionDuration: ".300s",
        transitionTimingFunction: "ease-in",
      }}
    >
      <Box
        component={"span"}
        sx={{
          color: "#FFD1AA",
          fontSize: "1.8em",
          userSelect: "none",
        }}
      >
        {number}
      </Box>
    </Stack>
  );
};

export default Tile;
