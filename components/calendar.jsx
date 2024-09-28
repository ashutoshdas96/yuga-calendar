/**
 * BASE CYCLE
 * Golden Age: 5184 yrs   72°
 * Silver Age: 3888 yrs   54°
 * Bronze Age: 2592 yrs   36°
 * Iron Age  : 1296 yrs   18°
 * 
 * Total     : 12960 yrs  180°
 * Chatur Yuga : 25920 yrs  360°
 * 
 * Base/1000.
 */

import React, { useState, useEffect, useCallback } from "react";

import { YUGA_NAME_MAP, JOURNEY_MAP, YUGA_TAG, GOLDEN_COLOR_SOLID, SILVER_COLOR_SOLID, BRONZE_COLOR_SOLID, IRON_COLOR_SOLID, KEY_LEFT, KEY_UP, KEY_RIGHT, KEY_DOWN, INC, ANCHOR, ANCHOR_CELL, TURNS, SEGMENTS, CENTER_X, CENTER_Y, SVG_BOX, RADIUS, R1, R2, YUGA_SCALE_COLOR, getTag, formatToString, getDate, getCellAge, getYugaScale, IRON_ANCHOR, GOLDEN_ANCHOR, YUGA_SCALE, getCellAgeFromAngle } from "@/lib/utils";

import { YugaLinesSvg, SegmentBgSvg, OuterCircularTextSvg } from "./calendarSvg";
import { SpiralCalendar } from "./spiralCalendar";

import { useMouse } from "@/hooks/useMouse";

// ["b_1",  "B/10", "B/100", "B/1K", "B/10K", "B/100K", "B/1M"]
// ["b_1", "b_10", "b_100", "b_1k", "b_10k", "b_100k"]
const MASTER_DATA = {
  b_1: [],
  b_10: [],
  b_100: [],
  b_1k: [],
  b_10k: [],
  b_100k: [],
}

const JOURNEY = {
  b_1: { age: "", yr: "", cell: 0},
  b_10: { age: "", yr: "", cell: 0},
  b_100: { age: "", yr: "", cell: 0},
  b_1k: { age: "", yr: "", cell: 0},
  b_10k: { age: "", yr: "", cell: 0},
  b_100k: { age: "", yr: "", cell: 0},
}


export const Calaendar = () => {
  const [selectedCell, setSelectedCell] = useState(null);
  const [hoveredCell, setHoveredCell] = useState(null);

  const [masterData, setMasterData] = useState(MASTER_DATA);
  const [journey, setJourney] = useState(JOURNEY);

  const [factor, setFactor] = useState(1);
  const [anchor, setAnchor] = useState(ANCHOR);
  const [anchorCell, setAnchorCell] = useState(ANCHOR_CELL);

  const [pos, ref] = useMouse();

  useEffect(() => {
    let md = [];
    for (let i = 0; i <= TURNS * SEGMENTS - SEGMENTS*2; i++) {
      if (i >= anchorCell) {
        md.push(anchor + (i - anchorCell) * (INC / factor));
      } else if (i < anchorCell) {
        md.push(anchor - (anchorCell - i) * (INC / factor));
      }
    }
    console.log("Master Data Changed: ", md.length, TURNS * SEGMENTS - SEGMENTS*2)
    setMasterData((old) => {
      const newData = {...old};
      newData[getTag(factor)] = md;
      return newData;
    });
  }, [factor, anchor, anchorCell]);

  const handleCellNext = useCallback(() => {
    const tag = getTag(factor);
    setSelectedCell((index) => {
      if (index === 59) {
        setAnchor(masterData[tag][index]);
        index -= 20;
        setAnchorCell(index);
      }
      index += 1;
      setJourney((prevJ) => {
        prevJ[tag] = { age: getCellAge(index), yr: masterData[tag][index], cell: index };
        console.log({ age: getCellAge(index), yr: masterData[tag][index], cell: index });
        return prevJ;
      });
      return index;
    });
  }, [masterData, factor]);

  const handleCellPrev = useCallback(() => {
    const tag = getTag(factor);
    setSelectedCell((index) => {
      if (index === 0) {
        setAnchor(masterData[tag][index]);
        index += 20;
        setAnchorCell(index);
      }
      index -= 1;
      setJourney((prevJ) => {
        prevJ[tag] = { age: getCellAge(index), yr: masterData[tag][index], cell: index };
        console.log({ age: getCellAge(index), yr: masterData[tag][index], cell: index });
        return prevJ;
      });
      return index;
    });
  }, [masterData, factor]);

  const handleCellUp = useCallback(() => {
    const tag = getTag(factor);
    setSelectedCell((prev) => {
      let index = prev - 20;
      if (index < 0) {
        setAnchor(masterData[tag][prev]);
        prev += 20;
        index += 20;
        setAnchorCell(prev);
      }
      setJourney((prevJ) => {
        prevJ[tag] = { age: getCellAge(index), yr: masterData[tag][index], cell: index };
        console.log({ age: getCellAge(index), yr: masterData[tag][index], cell: index });
        return prevJ;
      });
      return index;
    });
  }, [masterData, factor]);

  const handleCellDown = useCallback(() => {
    const tag = getTag(factor);
    setSelectedCell((prev) => {
      let index = prev + 20;
      if (index > 59) {
        setAnchor(masterData[tag][prev]);
        prev -= 20;
        index -= 20;
        setAnchorCell(prev);
      }
      setJourney((prevJ) => {
        prevJ[tag] = { age: getCellAge(index), yr: masterData[tag][index], cell: index };
        console.log({ age: getCellAge(index), yr: masterData[tag][index], cell: index });
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
        setAnchor(masterData[getTag(prevFactor)][selectedCell]);
        const index = selectedCell % 2 ? IRON_ANCHOR : GOLDEN_ANCHOR;
        setSelectedCell(index);
        setAnchorCell(index);
        setJourney((prevJ) => {
          prevJ[getTag(nextFactor)] = { age: getCellAge(index), yr: masterData[getTag(prevFactor)][selectedCell], cell: index };
          console.log({ age: getCellAge(index), yr: masterData[getTag(prevFactor)][selectedCell], cell: index });
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
    const tag = getTag(factor);
    setSelectedCell(index);
    setJourney((prev) => {
      prev[tag] = { age: getCellAge(index), yr: masterData[tag][index], cell: index };
      console.log({ age: getCellAge(index), yr: masterData[tag][index], cell: index });
      return prev;
    });
  }, [masterData, factor]);

  const handleHoveredCell = useCallback((i) => {
    setHoveredCell(i);
  }, []);

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
        {Array.from(YUGA_TAG, (tag) => (
          <div className="flex flex-col h-wrap w-full items-center justify-center p-2 bg-black rounded-md">
            <span>{JOURNEY_MAP[journey[tag].age]}</span>
            <span>{formatToString(journey[tag].yr, 2)}</span>
          </div>
        ))}
      </div>
    )
  }, [journey]);

  const getCellInfo = useCallback((index) => {
    const yr = masterData[getTag(factor)][index];
    const {month, date} = getDate(yr);
    
    return (
      <div className="flex flex-row gap-6">
        <p>{formatToString(yr)} {yr < 0 ? "BCE" : "CE"}</p>
        
        <p>{`${month} \t ${formatToString(date)}`}</p>
        <p>Age: {YUGA_NAME_MAP[getCellAge(index)]}</p>
        <p>Cell: {index}</p>
      </div>
    );
  },[masterData, factor]);

  const getSysInfo = () => {
    return (
      <div className="flex flex-row gap-6">
        <p>Factor: {factor}</p>
        <p>Anchor: {anchor}</p>
        <p>AnchorCell: {anchorCell}</p>
      </div>
    );
  }

  const posX = pos.elementX * SVG_BOX / pos.width;
  const posY = pos.elementY * SVG_BOX / pos.height
  const va = Math.atan2(posY - CENTER_Y, posX - CENTER_X);
  const vad = va * 180 / Math.PI;
  // base angle parseInt(yA / 18)}, {formatToString(yA % 18)
  const uA = vad > 0 ? 360 - vad : -vad;
  const dSeg = parseInt(uA / 18);
  const dA = dSeg % 2 ? uA % 18 * 10 : uA % 18 * 10 + 180;
  const d2Seg = parseInt((dA+90) / 18);
  const d2A = d2Seg % 2 ? dA % 18 * 10 : dA % 18 * 10 + 180;

  const dAs = [dA, d2A];

  const getHoveredData = useCallback(() => {
    if (hoveredCell === null) return "";
    const y = masterData[getTag(factor)][hoveredCell];
    const yr = y + (uA % 18) * (INC / 18 / factor);
    const {month, date, year} = getDate(yr);
    
    return (
      <>
        {`${YUGA_SCALE[Math.log10(factor * 10)]} ${YUGA_NAME_MAP[getCellAgeFromAngle(dA)]}
        ${year}
        ${month}
        ${formatToString(date, 2)}
        `}
      </>
      );
  }, [masterData, hoveredCell, uA, factor, dA]);

  return (
    <div className="flex flex-col items-center justify-center p-4 max-h-screen max-w-screen bg-black text-white select-none">
      <svg width="100%" height="100%" viewBox={`0 0 ${SVG_BOX} ${SVG_BOX}`} ref={ref} className="w-min h-min">

        <SegmentBgSvg age="golden-age" />
        <SegmentBgSvg age="silver-age" />
        <SegmentBgSvg age="bronze-age" />
        <SegmentBgSvg age="iron-age" />

        <OuterCircularTextSvg
          radAngle={va}
          text={getHoveredData()}
          textFill={"white"}
        />


        <SpiralCalendar
          cellData={masterData[getTag(factor)]}
          selectedCell={selectedCell}
          handleCellClick={handleCellClick} 
          handleCellDoubleClick={handleYugaIn}
          handleHoveredCell={handleHoveredCell}
        />
        <YugaLinesSvg />

        { Array.from(dAs, (da, i) => (
          <path
            d={`M ${CENTER_X} ${CENTER_Y}
            L ${CENTER_X + R2 * Math.cos(-(da+90) * Math.PI / 180)} ${CENTER_X + R2 * Math.sin(-(da+90) * Math.PI / 180)}`}
            stroke={YUGA_SCALE_COLOR[i]}
            strokeWidth="3"
          />)
        )}

        {/* Central text */}
        {/* <text x={CENTER_X} y={CENTER_Y} textAnchor="middle" fill="white" fontSize="10">
          <tspan x={CENTER_X} dy="-1em">GOLDEN AGE</tspan>
        </text> */}

        {/* Highlight selected segment */}
        {/* {selectedSegment !== null && (
          <path
            d={`M ${CENTER_X} ${CENTER_Y}
            L ${CENTER_X + RADIUS * Math.cos(-selectedSegment * 2 * Math.PI / SEGMENTS)} ${CENTER_Y + RADIUS * Math.sin(-selectedSegment * 2 * Math.PI / SEGMENTS)}
            A ${RADIUS} ${RADIUS} 0 0 0 ${CENTER_X + RADIUS * Math.cos(-(selectedSegment + 1) * 2 * Math.PI / SEGMENTS)} ${CENTER_Y + RADIUS * Math.sin(-(selectedSegment + 1) * 2 * Math.PI / SEGMENTS)} Z`}
            fill="rgba(255, 255, 255, 0.2)"
            stroke="white"
            strokeWidth="1"
          />
        )} */}
      </svg>

      <div className="mt-4 p-2 bg-gray-800 rounded-lg shadow-lg w-full flex flex-row items-center justify-between gap-2">
        <div className="flex flex-col items-center justify-between w-20">
          {/* <span>{formatToString(posX)}</span>
          <span>{formatToString(posY)}</span> */}
          <span>{formatToString(uA)}</span>
          <span>{hoveredCell}</span>
          {/* <span>{pos.width}, {pos.height}</span> */}
          <span>{dSeg}, {formatToString(dA,1)}</span>
        </div>
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
        <div className="flex flex-col gap-4">
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
              disabled={factor === 1}
              onClick={() => handleYugaOut()}
            >OUT</button>
          </div>
        </div>
      </div>
    </div>
  )
};

