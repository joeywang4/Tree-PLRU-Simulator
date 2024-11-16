import { range, getColor } from './util';

const Tree = ({ ways, nodes, arrows, redNodes, redArrows, speed }) => {
  const width = 800;
  const height = 500;
  const rows = Math.log2(ways) + 1;
  const nodeWidth = (width / ways + Math.log2(ways - 1) * 16) * 0.4;

  const calcNodePos = (index) => {
    const row = Math.floor(Math.log2(index + 1));
    const columns = Math.pow(2, row);
    const col = index - columns + 1;
    return {
      x: (width / columns) * (col + 0.5),
      y: (row + 1) * height / (rows + 1)
    };
  }

  const calcArrowPos = (index, val) => {
    const { x: x1, y: y1 } = calcNodePos(index);
    const { x: x2, y: y2 } = calcNodePos(2 * index + val + 1);
    const diffX = x2 - x1;
    const diffY = y2 - y1;
    const angle = Math.atan2(diffY, diffX);
    return {
      x1: x1 + nodeWidth / 2 * Math.cos(angle),
      y1: y1 + nodeWidth / 2 * Math.sin(angle),
      x2: x2 - nodeWidth / 2 * Math.cos(angle),
      y2: y2 - nodeWidth / 2 * Math.sin(angle),
    };
  }

  return (
    <svg viewBox='0 0 800 500' className="w-full">
      <defs>
        <marker id="arrow" viewBox="0 -5 10 10" refX="9" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,-5L10,0L0,5"></path>
        </marker>
        <marker id="arrowRed" viewBox="0 -5 10 10" refX="9" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,-5L10,0L0,5" fill="red"></path>
        </marker>
      </defs>
      {
        // draw parent nodes
        range(ways - 1).map((i) => {
          const { x, y } = calcNodePos(i);
          return (
            <circle
              key={`node-${i}`}
              cx={x}
              cy={y}
              r={nodeWidth/2}
              stroke="black"
              strokeWidth="1"
              fill="white"
            />
          );
        })
      }
      {
        // draw leaf nodes
        nodes.map((node, idx) => {
          const i = idx + ways - 1;
          const { x, y } = calcNodePos(i);
          return (
            <g key={`node-${i}`}>
              <circle
                cx={x}
                cy={y}
                r={nodeWidth/2}
                stroke={redNodes[idx] ? "red" : "black"}
                strokeWidth={redNodes[idx] ? 3 : 1}
                fill={node ? getColor(node) : "darkgray"}
              />
              <text x={x} y={y} fontFamily="Nunito Sans, sans-serif" fontWeight="400" fontSize="xx-large" dominantBaseline="middle" textAnchor="middle">
                {node}
              </text>
            </g>
          );
        })
      }
      {
        // draw arrows
        arrows.map((val, idx) => {
          const { x1, y1, x2, y2 } = calcArrowPos(idx, val);
          return (
            <path
              key={`arrow-${idx}`}
              d={`M ${x1},${y1} L ${x2},${y2}`}
              stroke={redArrows[idx] ? "red" : "black"}
              strokeWidth="2"
              markerEnd={`url(#arrow${redArrows[idx] ? "Red" : ""})`}
              style={{ transition: `${(100/speed).toFixed(1)}ms` }}
            />
          );
        })
      }
    </svg>
  );
}

export default Tree;
