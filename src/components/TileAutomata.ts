class TileAutomata {
  // [Range(0,100)]
  public waterChance = 30;
  // [Range(0,100)]
  public rockChance = 10;
  // [Range(1,8)]
  public birthLimit = 8;
  // [Range(1,8)]
  public deathLimit = 1;

  // [Range(1,10)]
  public numR = 0;

  private terrainMap: number[] = [];
  public Map: number[] = [];

  public tileX = 7;
  public tileY = 7;

  public start(nu: number) {
    if (!this.terrainMap.length) {
      this.initPos();
    }

    for (let i = 0; i < nu; i++) {
      this.terrainMap = this.genTilePos(this.terrainMap);
    }
    this.Map = this.terrainMap;
  }

  public initPos() {
    this.terrainMap = [];
    let count = 0;
    for (let x = 0; x < this.tileX; x++) {
      for (let y = 0; y < this.tileY; y++) {
        this.terrainMap[count++] =
          Random(1, 101) < this.waterChance
            ? 0
            : Random(1, 101) < this.rockChance
            ? 2
            : 1;
      }
    }
  }

  public genTilePos(oldMap: number[]) {
    const newMap = [];
    const myB = [-1, -1, 3, 3, 1];

    let neighb = 0;

    let count = 0;

    for (let x = 0; x < this.tileX; x++) {
      for (let y = 0; y < this.tileY; y++) {
        neighb = 0;
        for (let b of myB) {
          if (
            x + b >= 0 &&
            y + b >= 0 &&
            x + b < this.tileX &&
            y + b < this.tileY
          ) {
            neighb += oldMap[count];
          } else {
            neighb++;
          }
        }

        if (oldMap[count] === 1) {
          if (neighb < this.deathLimit) newMap[count] = 0;
          else {
            newMap[count] = 1;
          }
        }

        if (oldMap[count] === 0) {
          if (neighb > this.birthLimit) newMap[count] = 1;
          else {
            newMap[count] = 0;
          }
        }
        count++;
      }
    }

    return newMap;
  }
}

function Random(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

const t = new TileAutomata();

t.start(1);

console.log(t.Map);

export {};
