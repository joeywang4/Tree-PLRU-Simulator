const range = (n) => [...Array(n).keys()];

const colors = [
  "#f44336",
  "#f34dfc",
  "#d3a9f4",
  "#00bcd4",
  "#90d890",
  "#8bc34a",
  "#cddc39",
  "#ffeb3b",
  "#ffc107",
  "#ff9800",
  "#ff5722",
  "#90ee90",
]

const getColor = (c) => colors[c.charCodeAt(0) % colors.length];

const parseInput = (s) => {
  const output = [];
  for (let i = 0; i < s.length; i++) {
    const code = s.charCodeAt(i);
    if (!(code > 47 && code < 58) && // numeric (0-9)
      !(code > 64 && code < 91) && // upper alpha (A-Z)
      !(code > 96 && code < 123)) { // lower alpha (a-z)
      continue;
    }
    output.push(s[i]);
  }
  return output;
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

export { range, getColor, parseInput, sleep };
