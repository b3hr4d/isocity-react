let timer: NodeJS.Timeout;

export const throttle = (func: () => void, wait = 300) => {
  clearTimeout(timer);
  timer = setTimeout(() => func(), wait);
};

export const generateRandom = (
  length = 7,
  iniChance = 0
): [number, number][][] =>
  Array.from({ length }, () =>
    Array.from({ length }, () => [0, random(1, 101) < iniChance ? 1 : 0])
  );

export const random = (min: number, max: number) =>
  Math.random() * (max - min) + min;
