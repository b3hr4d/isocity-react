import { useCallback, useEffect } from "react";
import { useCanvasContext } from "../context/context";

interface BackgroundProps extends React.HTMLAttributes<HTMLCanvasElement> {
  tileMap: Uint8Array;
}

const Background: React.FC<BackgroundProps> = ({ tileMap, ...rest }) => {
  const {
    canvasRef,
    texHeight,
    texWidth,
    tileHeight,
    tileWidth,
    tileNumber,
    width,
    height,
    img,
    ctx,
    clear,
  } = useCanvasContext();

  const drawTile = useCallback(
    (x: number, y: number, row: number, col: number) => {
      if (img && ctx) {
        ctx.save();
        ctx.translate(((y - x) * tileWidth) / 2, ((x + y) * tileHeight) / 2);
        ctx.drawImage(
          img,
          row * texWidth,
          col * texHeight,
          texWidth,
          texHeight,
          -tileHeight - 1,
          -tileWidth - 2,
          texWidth,
          texHeight
        );
        ctx.restore();
      }
    },
    [ctx, tileHeight, tileWidth, texHeight, texWidth, img]
  );

  useEffect(() => {
    if (ctx && img) {
      clear();

      tileMap.forEach((t, i) => {
        const x = Math.trunc(i / tileNumber);
        const y = Math.trunc(i % tileNumber);
        const row = Math.trunc(t / texWidth);
        const col = Math.trunc(t % texWidth);
        drawTile(x, y, row, col);
      });
    }
  }, [tileMap, drawTile, clear, ctx, img, tileNumber, texWidth]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        background: "black",
      }}
      {...rest}
    />
  );
};

export default Background;
