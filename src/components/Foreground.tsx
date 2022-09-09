import { useCallback, useState } from "react";
import { useCanvasContext } from "../context/context";

interface ForegroundProps extends React.HTMLAttributes<HTMLCanvasElement> {
  tileChanger: (row: number, col: number, value: number) => void;
}

const Foreground: React.FC<ForegroundProps> = ({ tileChanger, ...rest }) => {
  const { ctx, width, height, texWidth, tileHeight, tileWidth, tileNumber } =
    useCanvasContext();

  const [fctx, setFctx] = useState<CanvasRenderingContext2D>();

  const clear = useCallback(() => {
    if (fctx) {
      fctx.clearRect(-width, -height, width * 2, height * 2);
    }
  }, [fctx, height, width]);

  const getPosition = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
      const _y = (e.nativeEvent.offsetY - tileHeight * 2) / tileHeight,
        _x = e.nativeEvent.offsetX / tileWidth - tileNumber / 2;
      const x = Math.floor(_y - _x);
      const y = Math.floor(_x + _y);
      return [x, y];
    },
    [tileHeight, tileWidth, tileNumber]
  );

  const click = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
      e.preventDefault();
      const [row, col] = getPosition(e);

      if (row >= 0 && row < tileNumber && col >= 0 && col < tileNumber) {
        const zero = e.button === 2 ? 0 : 1;
        const one = e.button === 2 ? 0 : 0;
        tileChanger(row, col, zero * texWidth + one);
      }
    },
    [getPosition, texWidth, tileNumber, tileChanger]
  );

  const drawForeTile = useCallback(
    (x: number, y: number, color: string) => {
      if (fctx) {
        fctx.save();
        fctx.translate(((y - x) * tileWidth) / 2, ((x + y) * tileHeight) / 2);
        fctx.beginPath();
        fctx.moveTo(0, 0);
        fctx.lineTo(tileWidth / 2, tileHeight / 2);
        fctx.lineTo(0, tileHeight);
        fctx.lineTo(-tileWidth / 2, tileHeight / 2);
        fctx.closePath();
        fctx.fillStyle = color;
        fctx.fill();
        fctx.strokeStyle = "red";
        fctx.stroke();
        fctx.restore();
      }
    },
    [fctx, tileHeight, tileWidth]
  );

  const drawGrid = useCallback(() => {
    for (let i = 0; i < tileNumber; i++) {
      for (let j = 0; j < tileNumber; j++) {
        drawForeTile(i, j, "rgba(0,0,0,0.1)");
      }
    }
  }, [drawForeTile, tileNumber]);

  const shadowViz: React.MouseEventHandler<HTMLCanvasElement> = useCallback(
    (e) => {
      if (fctx) {
        const [row, col] = getPosition(e);
        clear();
        //draw a grid of tiles
        drawGrid();
        if (row >= 0 && row < tileNumber && col >= 0 && col < tileNumber)
          drawForeTile(row, col, "rgba(0,0,0,0.5)");
      }
    },
    [clear, drawGrid, drawForeTile, fctx, getPosition, tileNumber]
  );

  const canvasRef = useCallback(
    (canvas: HTMLCanvasElement) => {
      if (canvas && ctx) {
        canvas.width = ctx.canvas.width;
        canvas.height = ctx.canvas.height;

        const fctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        fctx.translate(width / 2, tileHeight * 2);

        setFctx(fctx);
        drawGrid();
      }
    },
    [ctx, width, tileHeight, drawGrid]
  );

  return (
    <canvas
      ref={canvasRef}
      onMouseMove={shadowViz}
      onContextMenu={click}
      onClick={click}
      width={width}
      height={height}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 1,
      }}
      {...rest}
    />
  );
};

export default Foreground;
