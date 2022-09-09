import { useCallback, useState } from "react";
import { useCanvasContext } from "../context/context";

const useTileMap = () => {
  const { tileNumber } = useCanvasContext();

  const [tileMap, setTileMap] = useState<Uint8Array>(
    new Uint8Array(tileNumber * tileNumber)
  );

  const tileChanger = useCallback(
    (row: number, col: number, value: number) => {
      setTileMap((prev) => {
        const newTileMap = new Uint8Array(prev);
        newTileMap[row * tileNumber + col] = value;
        return newTileMap;
      });
    },
    [tileNumber]
  );

  return { tileChanger, tileMap };
};

export default useTileMap;
