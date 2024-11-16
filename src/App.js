import { useState } from 'react';
import queryString from 'query-string';
import Tree from './Tree';
import Tape from './Tape';
import useBreakpoints from './hooks/useBreakpoints';
import { parseInput, sleep } from './util';

const findLineIndex = (newLine, nodes, arrows) => {
  let index = nodes.findIndex((node) => node === newLine);
  if (index === -1) {
    index = 0;
    while (index < arrows.length) {
      index = arrows[index] ? index * 2 + 2 : index * 2 + 1;
    }
    return index;
  }
  return index + nodes.length - 1;
}

const updateArrows = (arrows, idx) => {
  const newArrows = [...arrows];
  const redArrows = new Array(arrows.length).fill(0);
  let i = idx;
  while (i > 0) {
    const parent = Math.floor((i - 1) / 2);
    newArrows[parent] = i % 2;
    redArrows[parent] = 1;
    i = parent;
  }
  return [newArrows, redArrows];
}

const validateParams = (params) => {
  const output = {...params};
  if (params.ways) {
    const ways = parseInt(params.ways);
    if ([2, 4, 8, 16].includes(ways)) {
      output.ways = ways;
    }
    else {
      delete output.ways;
    }
  }
  return output;
}

const setHash = (params) => {
  const hash = queryString.stringify(params);
  window.location.hash = hash;
}

const buttonStyle = " text-white font-bold py-2 px-4 rounded-full";

function App() {
  const params = validateParams(queryString.parse(window.location.hash));
  const [ways, setWays] = useState(params.ways ?? 8);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [textInput, setTextInput] = useState(params.pattern ?? '');
  const [tape, setTape] = useState([]);
  const [arrows, setArrows] = useState(new Array(ways - 1).fill(0));
  const [redArrows, setRedArrows] = useState(new Array(ways - 1).fill(0));
  const [nodes, setNodes] = useState(new Array(ways).fill(null));
  const [redNodes, setRedNodes] = useState(new Array(ways).fill(0));
  const [disabled, setDisabled] = useState(false);
  const [play, setPlay] = useState(false);
  const [stop, setStop] = useState(false);
  const [speed, setSpeed] = useState(1);
  const size = useBreakpoints();

  const reset = (newWays = ways) => {
    if (newWays !== ways && newWays) {
      setWays(newWays);
      params.ways = newWays;
      setHash(params);
    }
    setHits(0);
    setMisses(0);
    setArrows(new Array(newWays - 1).fill(0));
    setRedArrows(new Array(newWays - 1).fill(0));
    setNodes(new Array(newWays).fill(null));
    setRedNodes(new Array(newWays).fill(0));
    setTape([]);
    setPlay(false);
    setStop(false);
  }

  const step = async () => {
    if (tape.length === 0) {
      setPlay(false);
      return;
    }
    setDisabled(true);

    const line = tape[0];
    const lineIdx = findLineIndex(line, nodes, arrows);
    const [newArrows, newRedArrows] = updateArrows(arrows, lineIdx);

    const oldLine = nodes[lineIdx - ways + 1];
    if (line === oldLine) {
      setHits(hits + 1);
      const newRedNodes = new Array(ways).fill(0);
      newRedNodes[lineIdx - ways + 1] = 1;
      setRedNodes(newRedNodes);
      await sleep(600 / speed);
      setRedNodes(new Array(ways).fill(0));
    }
    else {
      setMisses(misses + 1);
      setRedArrows(newRedArrows);
      await sleep(1000 / speed);
      setRedArrows(new Array(ways - 1).fill(0));
    }

    setTape(tape.slice(1));
    setArrows(newArrows);
    const newNodes = [...nodes];
    newNodes[lineIdx - ways + 1] = line;
    setNodes(newNodes);
    setDisabled(false);
  }

  // handle play and stop
  if (stop) {
    setStop(false);
    setPlay(false);
  }

  if (play && !disabled && !stop) {
    step();
  }

  return (
    <div className='max-w-[1920px] m-auto'>
      <h1 className='text-3xl p-2 lg:py-4'>Tree PLRU simulator</h1>
      <div className='2xl:flex 2xl:justify-center'>
        {/* left column */}
        <div className="my-0 px-2 w-full max-w-5xl">
          <Tape size={size === "min" ? 16 : 32} tape={tape} />
          <Tree ways={ways} nodes={nodes} arrows={arrows} redArrows={redArrows} redNodes={redNodes} speed={speed} />
        </div>

        {/* right column */}
        <div className="px-2 w-full max-w-5xl">
          <div className="flex flex-wrap mb-6">
            <div className="px-2 w-full">
              <label className="block tracking-wide text-2xl text-gray-700 font-bold mb-4">
                Access pattern
              </label>
              <textarea
                rows={3}
                className="appearance-none block bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 w-full"
                placeholder="Enter the access pattern here. One character corresponds to one cache line. Alphanumeric values are acceptable (a-zA-Z0-9)."
                value={textInput}
                onChange={(e) => {
                  setTextInput(e.target.value);
                  params.pattern = e.target.value;
                  setHash(params);
                }}
              />
              <button
                onClick={() => setTape(parseInput(textInput))}
                disabled={disabled}
                className={'bg-blue-500 hover:bg-blue-700 disabled:bg-slate-500' + buttonStyle}
              >
                Set access pattern
              </button>
            </div>
            <div className="px-2 mt-4 w-full">
              <label className="block tracking-wide text-2xl text-gray-700 font-bold mb-4">
                Number of ways
              </label>
              <select
                value={ways}
                onChange={e => { reset(parseInt(e.target.value)); }}
                disabled={disabled}
                className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg disabled:bg-gray-500 focus:ring-blue-500 focus:border-blue-500 block w-full max-w-16 p-2.5'
              >
                <option value="2">2</option>
                <option value="4">4</option>
                <option value="8">8</option>
                <option value="16">16</option>
              </select>
            </div>
            <div className="px-2 mt-4 w-full">
              <label className="block tracking-wide text-2xl text-gray-700 font-bold mb-4">
                Speed
              </label>
              <input
                type="range"
                id="speed"
                min="0.20"
                max="10"
                step="0.05"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
              />
              <label htmlFor="speed" className='ml-2'>{speed.toFixed(2)}X</label>
            </div>
            <div className="px-2 mt-4 w-full">
              <label className="block tracking-wide text-2xl text-gray-700 font-bold mb-4">
                Controls
              </label>
              <button
                disabled={disabled}
                onClick={() => reset(ways)}
                className={'bg-orange-500 hover:bg-orange-700 disabled:bg-slate-500' + buttonStyle}
              >
                Reset
              </button>
              <button
                disabled={disabled || tape.length === 0}
                onClick={step}
                className={'bg-blue-500 hover:bg-blue-700 disabled:bg-slate-500 ml-2' + buttonStyle}
              >
                Step
              </button>
              <button
                disabled={(disabled || tape.length === 0) && !play}
                onClick={() => play ? setStop(true) : setPlay(true)}
                className={`
                  ${play ? 'bg-red-500 hover:bg-red-700' : 'bg-blue-500 hover:bg-blue-700'}
                  disabled:bg-slate-500 ml-2 ${buttonStyle}
                `}
              >
                {play ? "Stop" : "Play"}
              </button>
            </div>
            <div className="px-2 mt-4 w-full">
              <label className="block tracking-wide text-2xl text-gray-700 font-bold mb-4">
                Statistics
              </label>
              <ul className='list-disc px-6'>
                <li>Cache hits: {hits}</li>
                <li>Cache misses: {misses}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
