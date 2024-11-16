import { range, getColor } from "./util";

const Tape = ({ size, tape }) => {
  const elementWidth = 25;

  return (
    <svg viewBox={`0 0 ${elementWidth * size} ${elementWidth+2}`} className="w-full">
      {
        range(size).map((i) => {
          const x = i * elementWidth;
          const c = i < tape.length ? tape[i] : null;
          return (
            <g key={`tape-${i}`}>
              <rect x={x} y="0" width="25" height="25" stroke="black" fill={c ? getColor(c) : "white"} />
              <text x={x+12} y="13" fontFamily="Nunito Sans, sans-serif" fontWeight="360" fontSize="larger" dominantBaseline="middle" textAnchor="middle">
                {c}
              </text>
            </g>
          );
        })
      }
    </svg>
  )
}

export default Tape;
