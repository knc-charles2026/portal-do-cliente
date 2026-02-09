// frontend/src/components/LedLines.jsx
import React from "react";
import { Box, keyframes } from "@mui/material";

/* ===== ANIMAÇÕES ===== */

/* esquerda → direita | sobe em diagonal no final */
const moveRightDiagonalUp = keyframes`
  0% {
    transform: translateX(-120%) translateY(0);
  }

  90% {
    transform: translateX(60vw) translateY(0);
  }

  97% {
    transform: translateX(80vw) translateY(-48px);
  }

  100% {
    transform: translateX(120vw) translateY(-48px);
  }
`;

/* direita → esquerda | desce em diagonal no final */
const moveLeftDiagonalDown = keyframes`
  0% {
    transform: translateX(120%) translateY(0);
  }

  90% {
    transform: translateX(-60vw) translateY(0);
  }

  97% {
    transform: translateX(-80vw) translateY(48px);
  }

  100% {
    transform: translateX(-120vw) translateY(48px);
  }
`;

/* linhas externas retas */
const moveLeft = keyframes`
  0% { transform: translateX(120%); }
  100% { transform: translateX(-120%); }
`;

const moveRight = keyframes`
  0% { transform: translateX(-120%); }
  100% { transform: translateX(120%); }
`;

/* ===== CONFIG ===== */
const ledLinesConfig = [
  { top: "calc(10% + 30px)", duration: 68 },
  { top: "39%", duration: 90, diagonal: true },
  { top: "74.3%", duration: 90, diagonal: true },
  { top: "94%", duration: 68 },
];

const LedLines = () => {
  return (
    <>
      {ledLinesConfig.map((line, index) => {
        const isRight = index % 2 !== 0;

        const animation = line.diagonal
          ? isRight
            ? moveRightDiagonalUp
            : moveLeftDiagonalDown
          : isRight
          ? moveRight
          : moveLeft;

        return (
          <Box
            key={index}
            sx={{
              position: "absolute",
              top: line.top,
              left: 0,
              width: "100%",
              height: "5px",
              pointerEvents: "none",
              zIndex: 0,
              overflow: "visible",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background: isRight
                  ? "linear-gradient(90deg, rgba(38,197,255,0.25) 0%, rgba(38,197,255,1) 100%)"
                  : "linear-gradient(90deg, rgba(38,197,255,1) 0%, rgba(38,197,255,0.25) 100%)",
                animation: `${animation} ${line.duration}s linear infinite`,
                willChange: "transform",
              }}
            />
          </Box>
        );
      })}
    </>
  );
};

export default LedLines;
