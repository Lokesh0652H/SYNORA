import type { CSSProperties } from 'react';

const fish = [
  '....#....................',
  '...###...................',
  '..#####......##..........',
  '.#######....####......##..',
  '#########################.',
  '##########################',
  '.########################.',
  '..######################..',
  '...####################...',
  '.....###############.......',
  '....########..#######.......',
  '...######........#####.......',
];
const glyphs = ['·', ':', '+', '×', 'x', '°', 'S', '░'];

function Fish({ variant }: { variant: string }) {
  const columns=Math.max(...fish.map(row=>row.length));
  const style={gridTemplateColumns:`repeat(${columns}, var(--fish-cell))`} as CSSProperties;
  return <div className={`pixel-fish ${variant}`} style={style} aria-hidden="true">
    {fish.flatMap((row, y) => [...row].map((cell, x) => cell === '#' ? <span className="fish-cell" style={{animationDelay:`-${x*32+y*11}ms`}} key={`${y}-${x}`}>{glyphs[(x * 7 + y * 3) % glyphs.length]}</span> : <span className="fish-cell empty-cell" key={`${y}-${x}`} />))}
  </div>;
}

export default function MovingFish() {
  return <div className="fish-scene" aria-hidden="true"><Fish variant="fish-one"/><Fish variant="fish-two"/><Fish variant="fish-three"/></div>;
}

