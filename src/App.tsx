import { useCallback, useState } from "react";
import Background from "./components/Background";
import Foreground from "./components/Foreground";
import { useCanvasContext } from "./context/context";

interface AppProps {}

const App: React.FC<AppProps> = () => {
  const { width, height } = useCanvasContext();

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

  return (
    <div style={{ position: "relative", width, height, margin: "auto" }}>
      <Background tileMap={tileMap} />
      <Foreground tileChanger={tileChanger} />
    </div>
  );
};

export default App;
