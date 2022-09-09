//setup react context for using canvas
import { createContext, useCallback, useContext, useState } from "react";
import { throttle } from "../helpers";
import city from "../hooks/assets/city.png";

type CanvasType = {
  ctx: CanvasRenderingContext2D | undefined;
  img: HTMLImageElement | undefined;
  clear: () => void;
  canvasRef: (canvas: HTMLCanvasElement) => void;
  tileNumber: number;
  chance: number;
  width: number;
  height: number;
  tileHeight: number;
  tileWidth: number;
  texWidth: number;
  texHeight: number;
};

const defaultValue: CanvasType = {
  ctx: undefined,
  img: undefined,
  clear: () => {},
  canvasRef: () => {},
  tileHeight: 64,
  tileWidth: 128,
  tileNumber: 8,
  chance: 20,
  texWidth: 130,
  texHeight: 230,
  width: 128 * 7,
  height: 64 * 7,
};

const CanvasContext = createContext<CanvasType>(defaultValue);

export const useCanvasContext = () => useContext(CanvasContext);

interface CanvasProps
  extends React.HTMLAttributes<HTMLCanvasElement>,
    Partial<CanvasType> {}

export const CanvasProvider: React.FC<CanvasProps> = ({
  children,
  ...rest
}) => {
  const { tileNumber, chance, tileHeight, tileWidth, texWidth, texHeight } = {
    ...rest,
    ...defaultValue,
  };

  const [{ width, height }, setSize] = useState({
    width: tileWidth * tileNumber,
    height: tileHeight * tileNumber + tileHeight * 3,
  });

  const [img, setImg] = useState<HTMLImageElement>();

  const [ctx, setContext] = useState<CanvasRenderingContext2D>();

  const tileImage = (img: HTMLImageElement) => {
    setImg(img);
  };

  const canvasRef = useCallback(
    (canvas: HTMLCanvasElement) => {
      if (canvas) {
        const width = tileWidth * tileNumber;
        const height = tileHeight * tileNumber + tileHeight * 3;

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        ctx.translate(width / 2, tileHeight * 2);

        setSize({ width, height });

        throttle(() => setContext(ctx));
      }
    },
    [tileHeight, tileNumber, tileWidth]
  );

  const clear = useCallback(() => {
    if (ctx) {
      ctx.clearRect(-width, -height, width * 2, height * 2);
    }
  }, [ctx, height, width]);

  return (
    <CanvasContext.Provider
      value={{
        canvasRef,
        ctx,
        clear,
        img,
        width,
        height,
        tileHeight,
        tileWidth,
        texWidth,
        texHeight,
        tileNumber,
        chance,
      }}
    >
      <img src={city} alt="city" ref={tileImage} style={{ display: "none" }} />
      {children}
    </CanvasContext.Provider>
  );
};
