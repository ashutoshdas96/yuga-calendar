import React, { useState, useEffect, useCallback } from 'react';


/**
 * BASE CYCLE
 * Golden Age: 5184 yrs   72°
 * Silver Age: 3888 yrs   54°
 * Bronze Age: 2592 yrs   36°
 * Iron Age  : 1296 yrs   18°
 * 
 * Total     : 12960 yrs  180°
 * Maha Yuga : 25920 yrs  360°
 * 
 * Base/1000 is of significant importance.
 */


function formatToString(num, fix = 3) {
  // caling Number() removes decimal 00 in num representations
  return num ? Number(num.toFixed(fix)).toString(): "...";
}

const KEY_LEFT = 37;
const KEY_UP = 38;
const KEY_RIGHT = 39;
const KEY_DOWN = 40;

const INC = 1296;

const ANCHOR = -3102
const ANCHOR_CELL = 34


const getYugaSvgData = (age) => {
  let up, down, segs, fill;
  switch (age) {
    case "golden-age":
      segs = 4;
      up = 1;
      down = 5;
      fill = GOLDEN_COLOR;
      break;
    case "silver-age":
      segs = 3;
      up = 18;
      down = 9;
      fill = SILVER_COLOR;
      break;
    case "bronze-age":
      segs = 2;
      up = 16;
      down = 12;
      fill = BRONZE_COLOR;
      break;
    case "iron-age":
      segs = 1;
      up = 15;
      down = 14;
      fill = IRON_COLOR;
      break;
    default:
      fill = "rgba(255, 255, 255, 1)"
      break;
  }
  return {up, down, segs, fill};
}

// month map
const mm = {
  0: "JAN",
  1: "FEB",
  2: "MAR",
  3: "APR",
  4: "MAY",
  5: "JUN",
  6: "JUL",
  7: "AUG",
  8: "SEP",
  9: "OCT",
  10: "NOV",
  11: "DEC"
}

// name amp
const nm = {
  GU: "Golden Age ↑",
  GD: "Golden Age ↓",
  SD: "Silver Age ↓",
  BD: "Bronze Age ↓",
  ID: "Iron Age ↓",
  IU: "Iron Age ↑",
  BU: "Bronze Age ↑",
  SU: "Silver Age ↑",
}

// journey map
const jm = {
  GU: "G↑",
  GD: "G↓",
  SD: "S↓",
  BD: "B↓",
  ID: "I↓",
  IU: "I↑",
  BU: "B↑",
  SU: "S↑",
}

const getDate = (yr) => {
  const d = yr % 1;
  const mi = d * 12;
  const date = (mi % 1) * 30;
  const month = mm[parseInt(mi).toString()];
  return {month, date, mi};
}

const getCellAge = (index) => {
  let k = index % 20;
  let age;
  if (k >= 1 && k < 5) age = "GU";
  else if (k >= 5 && k < 9) age = "GD";
  else if (k >= 9 && k < 12) age = "SD";
  else if (k >= 12 && k < 14) age = "BD";
  else if (k == 14) age = "ID";
  else if (k == 15) age = "IU";
  else if (k >= 16 && k < 18) age = "BU";
  else if ((k >= 18) || (k < 1)) age = "SU";
  return age;
}
  

const GOLDEN_COLOR = "rgba(255, 215, 0, 0.2)";
const SILVER_COLOR = "rgba(192, 192, 192, 0.2)";
const BRONZE_COLOR = "rgba(205, 127, 50, 0.2)";
const IRON_COLOR = "rgba(255, 255, 255, 0)";

const GOLDEN_COLOR_SOLID = "rgb(255, 215, 0)";
const SILVER_COLOR_SOLID = "rgb(192, 192, 192)";
const BRONZE_COLOR_SOLID = "rgb(205, 127, 50)";
const IRON_COLOR_SOLID = "rgb(255, 255, 255)";

const JOURNEY_TAG = ["b_1", "b_10", "b_100", "b_1_000", "b_10_000", "b_100_000"];
const getTag = (num) => {
  let acc = 0;
  for (let n=num;n>=10;n /= 10, acc += 1);
  console.log("GET TAG \n.   acc: " , acc, "journey: ", JOURNEY_TAG[acc]);
  return JOURNEY_TAG[acc];
}

const JOURNEY = {
  b_1: { age: "", yr: "", cell: 0},
  b_10: { age: "", yr: "", cell: 0},
  b_100: { age: "", yr: "", cell: 0},
  b_1_000: { age: "", yr: "", cell: 0},
  b_10_000: { age: "", yr: "", cell: 0},
  b_100_000: { age: "", yr: "", cell: 0},
}

const centerX = 300
const centerY = 300
const radius = 250
const segments = 20

const turns = 5;





const Calaendar = () => {
  const [selectedCell, setSelectedCell] = useState(null);

  const [masterData, setMasterData] = useState([]);

  // const [selectedSegment, setSelectedSegment] = useState("b_1");
  const [factor, setFactor] = useState(1);
  const [anchor, setAnchor] = useState(ANCHOR);
  const [anchorCell, setAnchorCell] = useState(ANCHOR_CELL);

  const [journey, setJourney] = useState(JOURNEY);

  useEffect(() => {
    let md = [];
    for (let i = 0; i <= turns * segments - segments*2; i++) {
      if (i >= anchorCell) {
        md.push(anchor + (i - anchorCell) * (INC / factor));
      } else if (i < anchorCell) {
        md.push(anchor - (anchorCell - i) * (INC / factor));
      }
    }
    console.log("Master Data Changed: ", md.length, turns * segments - segments*2)
    setMasterData(md);
  }, [factor, anchor, anchorCell]);

  const handleCellNext = useCallback(() => {
    setSelectedCell((index) => {
      if (index === 59) {
        setAnchor(masterData[index]);
        index -= 20;
        setAnchorCell(index);
      }
      index += 1;
      setJourney((prevJ) => {
        prevJ[getTag(factor)] = { age: getCellAge(index), yr: masterData[index], cell: index };
        console.log({ age: getCellAge(index), yr: masterData[index], cell: index });
        return prevJ;
      });
      return index;
    });
  }, [masterData, factor]);

  const handleCellPrev = useCallback(() => {
    setSelectedCell((index) => {
      if (index === 0) {
        setAnchor(masterData[index]);
        index += 20;
        setAnchorCell(index);
      }
      index -= 1;
      setJourney((prevJ) => {
        prevJ[getTag(factor)] = { age: getCellAge(index), yr: masterData[index], cell: index };
        console.log({ age: getCellAge(index), yr: masterData[index], cell: index });
        return prevJ;
      });
      return index;
    });
  }, [masterData, factor]);

  const handleCellUp = useCallback(() => {
    setSelectedCell((prev) => {
      let index = prev - 20;
      if (index < 0) {
        setAnchor(masterData[prev]);
        prev += 20;
        index += 20;
        setAnchorCell(prev);
      }
      setJourney((prevJ) => {
        prevJ[getTag(factor)] = { age: getCellAge(index), yr: masterData[index], cell: index };
        console.log({ age: getCellAge(index), yr: masterData[index], cell: index });
        return prevJ;
      });
      return index;
    });
  }, [masterData, factor]);

  const handleCellDown = useCallback(() => {
    setSelectedCell((prev) => {
      let index = prev + 20;
      if (index > 59) {
        setAnchor(masterData[prev]);
        prev -= 20;
        index -= 20;
        setAnchorCell(prev);
      }
      setJourney((prevJ) => {
        prevJ[getTag(factor)] = { age: getCellAge(index), yr: masterData[index], cell: index };
        console.log({ age: getCellAge(index), yr: masterData[index], cell: index });
        return prevJ;
      });
      return index;
    });
  }, [masterData, factor]);

  const handleYugaIn = useCallback(() => {
    setFactor((prevFactor) => {
      let nextFactor = prevFactor * 10
      if (nextFactor > 100000) {
        nextFactor = prevFactor;
      } else {
        setAnchor(masterData[selectedCell]);
        const index = selectedCell % 2 ? 25 : 35;
        setSelectedCell(index);
        setAnchorCell(index);
        setJourney((prevJ) => {
          prevJ[getTag(nextFactor)] = { age: getCellAge(index), yr: masterData[selectedCell], cell: index };
          console.log({ age: getCellAge(index), yr: masterData[selectedCell], cell: index });
          return prevJ;
        });
      }
      return nextFactor;
    });
  }, [masterData, selectedCell]);

  const handleYugaOut = useCallback(() => {
    setFactor((prevFactor) => {
      let nextFactor = prevFactor / 10
      if (nextFactor < 1) {
        nextFactor = prevFactor;
      } else {
        setJourney((prevJ) => {
          let lastJ = prevJ[getTag(nextFactor)];
          setAnchor(lastJ.yr);
          setSelectedCell(lastJ.cell);
          setAnchorCell(lastJ.cell);
          console.log("OUT: ", { age: lastJ.age, yr: lastJ.yr, cell: lastJ.cell });
          prevJ[getTag(prevFactor)] = { age: "", yr: "", cell: 0 };
          return prevJ;
        });
      }
      return nextFactor;
    });
  }, []);

  const handleCellClick = useCallback((index) => {
    setSelectedCell(index);
    setJourney((prev) => {
      prev[getTag(factor)] = { age: getCellAge(index), yr: masterData[index], cell: index };
      console.log({ age: getCellAge(index), yr: masterData[index], cell: index });
      return prev;
    });
  }, [masterData, factor]);

  useEffect(() => {
    const down = (event) => {
      if (event.keyCode === KEY_LEFT) { // && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        handleCellPrev();
      }
      if (event.keyCode === KEY_RIGHT) { // && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        handleCellNext();
      }
      if (event.keyCode === KEY_UP) { // && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        handleCellUp();
      }
      if (event.keyCode === KEY_DOWN) { // && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        handleCellDown();
      }
      if (event.key === "i" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        handleYugaIn();
      }
      if (event.key === "o" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        handleYugaOut();
      }
    }
    document.addEventListener("keydown", down);

    return () => document.removeEventListener("keydown", down);
  }, [handleCellPrev, handleCellNext, handleCellUp, handleCellDown, handleYugaIn, handleYugaOut]);


  const getJourneyInfo = useCallback(() => {
    return (
      <div className="flex flex-row gap-2 justify-between">
        {Array.from(JOURNEY_TAG, (tag) => (
          <div className="flex flex-col h-wrap w-full items-center justify-center p-2 bg-black rounded-md">
            <span>{jm[journey[tag].age]}</span>
            <span>{formatToString(journey[tag].yr, 2)}</span>
          </div>
        ))}
      </div>
    )
  }, [journey]);

  const getCellInfo = useCallback((index) => {
    const yr = masterData[index];
    const {month, date} = getDate(yr);
    
    return (
      <div className="flex flex-row gap-6">
        <p>{formatToString(yr)} {yr < 0 ? "BCE" : "CE"}</p>
        
        <p>{`${month} \t ${formatToString(date)}`}</p>
        <p>Age: {nm[getCellAge(selectedCell)]}</p>
        <p>Cell: {index}</p>
      </div>
    );
  },[masterData, selectedCell]);

  const getSysInfo = () => {
    return (
      <div className="flex flex-row gap-6">
        <p>Factor: {factor}</p>
        <p>Anchor: {anchor}</p>
        <p>AnchorCell: {anchorCell}</p>
      </div>
    );
  }

  const generateSpiral = () => {
    let cells = [];

    let path = `M ${centerX} ${centerY} `
    for (let i = 0; i <= turns * segments; i++) {
      const angle = -(i / segments) * Math.PI * 2;
      const r = (radius * i) / (turns * segments);
      const x = centerX + r * Math.cos(angle);
      const y = centerY + r * Math.sin(angle);
      path += `L ${x} ${y} `;

      if (i >= segments) {
        cells.push({ x, y });
      }
    }

    let cellsPath = Array.from({length: turns * segments - segments*2}, (_, i) => {
      let stroke = "white";
      let k = i % 20;
      if (k >= 1 && k < 9) stroke = GOLDEN_COLOR_SOLID;
      if ((k >= 9 && k < 12) || (k >= 18) || (k < 1)) stroke = SILVER_COLOR_SOLID;
      if ((k >= 12 && k < 14) || (k >= 16 && k < 18)) stroke = BRONZE_COLOR_SOLID;
      if (k >= 14 && k < 16) stroke = IRON_COLOR_SOLID;

      const a_x = cells[i].x, a_y = cells[i].y;
      const b_x = cells[i+segments].x, b_y = cells[i+segments].y;
      const c_x = cells[i+1+segments].x, c_y = cells[i+1+segments].y;
      const d_x = cells[i+1].x, d_y = cells[i+1].y;

      
      const yr = masterData[i];
      const { date, month } = getDate(yr);

      return (
        <>
          <path
            key={i}
            d={`M ${a_x} ${a_y}
            L ${b_x} ${b_y} 
            L ${c_x} ${c_y}
            L ${d_x} ${d_y}
            Z`}
            fill={`rgba(255, 255, 255, ${i === selectedCell ? 0.2 : 0})`}
            stroke={stroke}
            strokeWidth="1"
            className="cursor-pointer hover:fill-white/[0.1]"
            onClick={() => handleCellClick(i)}
          />
          <text
            key={"text_" + i}
            transform={`translate(${(a_x+b_x)/2}, ${(a_y+b_y)/2}) rotate(${Math.atan2(b_y - a_y, b_x - a_x) * 180 / Math.PI})`}
            textAnchor="middle"
            fill="white"
            fontSize="10"
            className="pointer-events-none"
          >
            <tspan x={0} dy="-0.3em">{formatToString(yr, 2)}</tspan>
            <tspan x={0} dy="-1em">{month}</tspan>
            <tspan x={0} dy="-1em">{formatToString(date, 2)}</tspan>
          </text>
        </>
      )
    });


    return (
      <>
        <path d={path} fill="none" stroke="#FFA500" strokeWidth="2" />
        {cellsPath}
      </>
    );
  }

  const getYugaCells = (type) => {
    let { up, down, segs, fill } = getYugaSvgData(type);
    
    return (
      <>
      <path
        d={`M ${centerX} ${centerY}
          L ${centerX + radius * Math.cos(-up * 2 * Math.PI / segments)} ${centerY + radius * Math.sin(-up * 2 * Math.PI / segments)}
          A ${radius} ${radius} 0 0 0 ${centerX + radius * Math.cos(-(up + segs) * 2 * Math.PI / segments)} ${centerY + radius * Math.sin(-(up + segs) * 2 * Math.PI / segments)}
          Z`}
        fill={fill}
        strokeWidth="1"
      />
      <path
        d={`M ${centerX} ${centerY}
          L ${centerX + radius * Math.cos(-down * 2 * Math.PI / segments)} ${centerY + radius * Math.sin(-down * 2 * Math.PI / segments)}
          A ${radius} ${radius} 0 0 0 ${centerX + radius * Math.cos(-(down + segs) * 2 * Math.PI / segments)} ${centerY + radius * Math.sin(-(down + segs) * 2 * Math.PI / segments)}
          Z`}
        fill={fill}
        strokeWidth="1"
      />
      </>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white select-none">
      <svg width="100%" height="100%" viewBox="0 0 600 600" className="max-w-screen relative">

        {getYugaCells("golden-age")}
        {getYugaCells("silver-age")}
        {getYugaCells("bronze-age")}
        {getYugaCells("iron-age")}

        
        {generateSpiral()}
        <YugaLines />

        {/* Central text */}
        {/* <text x={centerX} y={centerY} textAnchor="middle" fill="white" fontSize="10">
          <tspan x={centerX} dy="-1em">GOLDEN AGE</tspan>
        </text> */}

        {/* Highlight selected segment */}
        {/* {selectedSegment !== null && (
          <path
            d={`M ${centerX} ${centerY} L ${centerX + radius * Math.cos(-selectedSegment * 2 * Math.PI / segments)} ${centerY + radius * Math.sin(-selectedSegment * 2 * Math.PI / segments)} A ${radius} ${radius} 0 0 0 ${centerX + radius * Math.cos(-(selectedSegment + 1) * 2 * Math.PI / segments)} ${centerY + radius * Math.sin(-(selectedSegment + 1) * 2 * Math.PI / segments)} Z`}
            fill="rgba(255, 255, 255, 0.2)"
            stroke="white"
            strokeWidth="1"
          />
        )} */}
      </svg>

      <div className="mt-4 p-2 bg-gray-800 rounded-lg shadow-lg w-full flex flex-col items-center justify-between gap-2">
        <div className="flex flex-col gap-2">
          {getJourneyInfo()}
          {/* <h2 className="text-xl font-semibold mb-2">Selected Cell</h2> */}
          {selectedCell !== null ? (
            getCellInfo(selectedCell)
          ) : (
            <p>No cell selected</p>
          )}
          {getSysInfo()}
        </div>
        <div className="flex flex-row gap-4">
          <div
            className="flex flex-row gap-2"
          >
            <button
              type="button"
              className="h-wrap w-wrap bg-blue-500 disabled:bg-gray-500 disabled:cursor-not-allowed hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
              // disabled={selectedCell === null}
              onClick={() => handleCellUp()}
            >up</button>
            <button
              type="button"
              className="h-wrap w-wrap bg-blue-500 disabled:bg-gray-500 disabled:cursor-not-allowed hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
              // disabled={selectedCell === null}
              onClick={() => handleCellDown()}
            >down</button>
          </div>
          <div
            className="flex flex-row gap-2"
          >
            <button
              type="button"
              className="h-wrap w-wrap bg-red-500 disabled:bg-gray-500 disabled:cursor-not-allowed hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full"
              disabled={selectedCell === null}
              onClick={() => handleYugaIn()}
            >IN</button>
            <button
              type="button"
              className="h-wrap w-wrap bg-red-500 disabled:bg-gray-500 disabled:cursor-not-allowed hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full"
              disabled={selectedCell === null}
              onClick={() => handleYugaOut()}
            >OUT</button>
          </div>
        </div>
      </div>
    </div>
  )
};





const YugaLines = () => {
  const count = segments;
  const r1 = radius * 0.23;
  const r2 = r1+10;
  const a1 = -234, a2 = -90, a3 = -306, a4 = -162, a5 = -18;

  const getGoldenText = (a) => {
    return (
      <text
        transform={`translate(${centerX + r2 * Math.cos(a * Math.PI / 180)}, ${centerY + r2 * Math.sin(a * Math.PI / 180)}) rotate(${a-90})`}
        textAnchor="middle"
        fill={GOLDEN_COLOR_SOLID}
        fontSize="7"
        className="pointer-events-none font-bold"
      >
        <tspan x="-0.6em" dy="-0.5em">{jm.GU}</tspan>
        <tspan x="0.7em" dy="0">{jm.GD}</tspan>
      </text>
    );
  }

  const getIronText = (a) => {
    return (
      <text
      transform={`translate(${centerX + r2 * Math.cos(a * Math.PI / 180)}, ${centerY + r2 * Math.sin(a * Math.PI / 180)}) rotate(${a-90})`}
        textAnchor="middle"
        fill={IRON_COLOR_SOLID}
        fontSize="7"
        className="pointer-events-none"
      >
        <tspan x="-0.4em" dy="-0.5em">{jm.ID}</tspan>
        <tspan x="0.6em" dy="0">{jm.IU}</tspan>
      </text>
    );
  }

  return (
    <>
      <circle cx={centerX} cy={centerY} r={r2} stroke="white" strokeWidth="1" fill="black" />
      <circle cx={centerX} cy={centerY} r={r1} stroke="white" strokeWidth="1" fill="black" />
      { Array.from({ length: count }, (_, i) => {
          const angle = -(i / count) * Math.PI * 2;
          const x2 = centerX + radius * Math.cos(angle);
          const y2 = centerY + radius * Math.sin(angle);
          const stroke = i % 2 ? "#00FF00" : "#FF0000";
          return (
            <line
              key={i}
              x1={centerX}
              y1={centerY}
              x2={x2}
              y2={y2}
              stroke={stroke}
              strokeWidth="1"
              className="cursor-pointer"
            />
          );
        })
      }
      <path 
        d={`M ${centerX + r1 * Math.cos(a1 * Math.PI / 180)} ${centerY + r1 * Math.sin(a1 * Math.PI / 180)}
          L ${centerX + r1 * Math.cos(a2 * Math.PI / 180)} ${centerY + r1 * Math.sin(a2 * Math.PI / 180)}
          L ${centerX + r1 * Math.cos(a3 * Math.PI / 180)} ${centerY + r1 * Math.sin(a3 * Math.PI / 180)}
          L ${centerX + r1 * Math.cos(a4 * Math.PI / 180)} ${centerY + r1 * Math.sin(a4 * Math.PI / 180)}
          L ${centerX + r1 * Math.cos(a5 * Math.PI / 180)} ${centerY + r1 * Math.sin(a5 * Math.PI / 180)}
          Z`}
        stroke="#FFFFFF"
        strokeWidth="1"
      />
      {getGoldenText(a1)}
      {getGoldenText(a2)}
      {getGoldenText(a3)}
      {getGoldenText(a4)}
      {getGoldenText(a5)}

      {getGoldenText(-a1)}
      {getGoldenText(-a2)}
      {getGoldenText(-a3)}
      {getGoldenText(-a4)}
      {getGoldenText(-a5)}

      {getIronText(a1-18)}
      {getIronText(a2-18)}
      {getIronText(a3-18)}
      {getIronText(a4-18)}
      {getIronText(a5-18)}

      {getIronText(-a1-18)}
      {getIronText(-a2-18)}
      {getIronText(-a3-18)}
      {getIronText(-a4-18)}
      {getIronText(-a5-18)}
    </>
  );
}

export default Calaendar;
