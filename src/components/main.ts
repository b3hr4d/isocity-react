const $ = (_: string) => document.querySelector(_) as Element;

const $c = (_: string) => document.createElement(_) as HTMLElement;

let canvas: HTMLCanvasElement,
  bg: CanvasRenderingContext2D,
  fg: HTMLCanvasElement,
  cf: CanvasRenderingContext2D,
  tools: Element,
  tool: [number, number] = [0, 0],
  activeTool: string | undefined,
  isPlacing: boolean;

const ntiles = 8;

const tileWidth = 128;
const tileHeight = 64;

const width = tileWidth * ntiles;
const height = tileHeight * ntiles;

/* texture from https://opengameart.org/content/isometric-landscape */
const texture = new Image();
texture.src = "./01_130x66_130x230.png";
texture.onload = (_) => init();

const textureWidth = 12;
const textureHeight = 6;

const generateRandom = (iniChance = 0): [number, number][][] =>
  Array.from({ length: ntiles }, () =>
    Array.from({ length: ntiles }, () => [
      0,
      Random(1, 101) < iniChance ? 1 : 0,
    ])
  );

const map: [number, number][][] = generateRandom();

function Random(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

const init = () => {
  canvas = $("#bg") as HTMLCanvasElement;
  canvas.width = width;
  canvas.height = height + tileHeight * 3;

  bg = canvas.getContext("2d") as CanvasRenderingContext2D;
  bg.translate(width / 2, tileHeight * 2);

  loadHashState(document.location.hash.substring(1));

  drawMap();

  fg = $("#fg") as HTMLCanvasElement;
  fg.width = canvas.width;
  fg.height = canvas.height;
  cf = fg.getContext("2d") as CanvasRenderingContext2D;
  cf.translate(width / 2, tileHeight * 2);
  fg.addEventListener("mousemove", shadowViz);
  fg.addEventListener("contextmenu", (e) => e.preventDefault());
  fg.addEventListener("mouseup", unclick);
  fg.addEventListener("mousedown", click);
  fg.addEventListener("touchend", touch);
  fg.addEventListener("pointerup", click);

  tools = $("#tools") as Element;

  let toolCount = 0;
  for (let i = 0; i < textureHeight; i++) {
    for (let j = 0; j < textureWidth; j++) {
      const div = $c("div");
      div.id = `tool_${toolCount++}`;
      div.style.display = "block";
      /* width of 132 instead of 130  = 130 image + 2 border = 132 */
      div.style.backgroundPosition = `-${j * 130 + 2}px -${i * 230}px`;
      div.addEventListener("click", (e) => {
        tool = [i, j];
        if (activeTool) $(`#${activeTool}`).classList.remove("selected");
        activeTool = (e.target as Element).id;
        $(`#${activeTool}`).classList.add("selected");
      });
      tools.appendChild(div);
    }
  }
};

const drawMap = () => {
  bg.clearRect(-width, -height, width * 2, height * 2);

  for (let i = 0; i < ntiles; i++) {
    for (let j = 0; j < ntiles; j++) {
      drawImageTile(bg, i, j, map[i][j][0], map[i][j][1]);
    }
  }
};

const drawTile = (
  c: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string
) => {
  c.save();
  c.translate(((y - x) * tileWidth) / 2, ((x + y) * tileHeight) / 2);
  c.beginPath();
  c.moveTo(0, 0);
  c.lineTo(tileWidth / 2, tileHeight / 2);
  c.lineTo(0, tileHeight);
  c.lineTo(-tileWidth / 2, tileHeight / 2);
  c.closePath();
  c.fillStyle = color;
  c.fill();
  c.restore();
};

const drawImageTile = (
  c: CanvasRenderingContext2D,
  x: number,
  y: number,
  i: number,
  j: number
) => {
  c.save();
  c.translate(((y - x) * tileWidth) / 2, ((x + y) * tileHeight) / 2);
  j *= 130;
  i *= 230;
  c.drawImage(texture, j, i, 130, 230, -65, -130, 130, 230);
  c.restore();
};

const getPosition = (e: MouseEvent) => {
  const _y = (e.offsetY - tileHeight * 2) / tileHeight,
    _x = e.offsetX / tileWidth - ntiles / 2;
  const x = Math.floor(_y - _x);
  const y = Math.floor(_x + _y);
  return { x, y };
};

const shadowViz = (e: MouseEvent) => {
  if (isPlacing) click(e);
  const pos = getPosition(e);
  cf.clearRect(-width, -height, width * 2, height * 2);
  if (pos.x >= 0 && pos.x < ntiles && pos.y >= 0 && pos.y < ntiles)
    drawTile(cf, pos.x, pos.y, "rgba(0,0,0,0.2)");
};

//events
const unclick = () => {
  if (isPlacing) isPlacing = false;
};

const touch = (e: TouchEvent): void => {
  //convert touch to mouse event
  const mouseEvent = new MouseEvent("mousedown", e);
  click(mouseEvent);
};

const click = (e: MouseEvent) => {
  const pos = getPosition(e);
  if (pos.x >= 0 && pos.x < ntiles && pos.y >= 0 && pos.y < ntiles) {
    map[pos.x][pos.y][0] = e.button === 2 ? 0 : tool[0];
    map[pos.x][pos.y][1] = e.button === 2 ? 0 : tool[1];
    isPlacing = true;

    drawMap();
    cf.clearRect(-width, -height, width * 2, height * 2);
  }
  updateHashState();
};

// Save and load Hash state
const ToBase64 = (u8: any) => {
  return window.btoa(String.fromCharCode.apply(null, u8));
};

const FromBase64 = (str: string) => {
  return window
    .atob(str)
    .split("")
    .map((c) => c.charCodeAt(0));
};

const updateHashState = () => {
  let c = 0;
  const u8 = new Uint8Array(ntiles * ntiles);
  for (let i = 0; i < ntiles; i++) {
    for (let j = 0; j < ntiles; j++) {
      u8[c++] = map[i][j][0] * textureWidth + map[i][j][1];
    }
  }
  const state = ToBase64(u8);
  console.log(state);
  // history.replaceState(null, "", `#${state}`);
};

const loadHashState = (state: string) => {
  const u8 = FromBase64(state);
  let c = 0;
  for (let i = 0; i < ntiles; i++) {
    for (let j = 0; j < ntiles; j++) {
      const t = u8[c++] || 0;
      const x = Math.trunc(t / textureWidth);
      const y = Math.trunc(t % textureWidth);
      map[i][j] = [x, y];
    }
  }
};

export {};
